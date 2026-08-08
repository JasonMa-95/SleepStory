# 晚安故事屋 · Vercel GlobalConfig & MongoDB 集成实现文档

> 适用项目：`sleep-story`（Vue 3 + Vite + VitePWA，部署到 Vercel）
> 文档目标：梳理「Vercel Global Config」与「MongoDB（Vercel Native Integration）」两条独立链路在
> 本项目中的配置、加载、使用方式，以及它们在启动时的加载顺序与依赖关系。

---

## 0. 总览与架构

这两个子系统是**相互独立、互不依赖**的两条链路：

```
┌─────────────────────────────────────────────────────────────┐
│  浏览器（前端）                                               │
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │ Global Config 读取    │    │  MongoDB 前端测试页       │   │
│  │ public/vercel-config │    │  public/mongo-db.html     │   │
│  │   .html              │    │     │ fetch                │   │
│  │   （直接 fetch / SDK）│    │     ▼                     │   │
│  └──────────┬───────────┘    │  /api/mongo-test          │   │
│             │                └────────────┬─────────────┘   │
│             ▼                             ▼                  │
│  global-config.vercel.com          Vercel Serverless Fn     │
│   （只读、非敏感配置）              api/mongo-test.js         │
│                                      │ 读 env.MONGODB_URI    │
│                                      ▼                      │
│                                   MongoDB Atlas             │
└─────────────────────────────────────────────────────────────┘
```

- **Global Config**：前端**直接**读取，适合放非敏感配置（如 `greeting` 欢迎语）。
- **MongoDB**：**绝不能**前端直连（URI 含账号密码），必须经 Vercel Serverless Function 后端代理。

---

## 1. 配置文件设置与初始化流程

### 1.1 Vercel 项目侧配置（仪表盘）

| 子系统 | 配置位置 | 产出 |
|--------|----------|------|
| Global Config | Storage → Global Config → 新建 | Config ID：`ecfg_8ocb38stza7vgsetjvuamp1kpwv6` |
| MongoDB | Storage → MongoDB（Vercel Native Integration）关联项目 | 自动注入环境变量 `MONGODB_URI` |

> Global Config 的只读令牌：**左侧 Tokens → Generate Token**，确认弹窗一次性给出完整
> 连接字符串 `https://global-config.vercel.com/<id>?token=<token>`（关掉后不可再查）。
> 注意：你复制的是 token 的 **UUID id** 还是真正的 **secret** 要分清；连接字符串 `?token=` 后面
> 必须是 secret 那串长字符串，否则返回 `401 unauthorized`（新建 token 还有约数秒生效延迟）。

### 1.2 本地环境变量

- 前端要用的 Global Config 连接字符串 → 放 `.env.local`，键名必须是 `VITE_` 前缀（Vite 才暴露给前端）：
  ```ini
  # .env.local（已被 .gitignore 的 *.local 忽略）
  VITE_GLOBAL_CONFIG="https://global-config.vercel.com/ecfg_8ocb38stza7vgsetjvuamp1kpwv6?token=xxx"
  ```
- 后端 / 脚本要用的 MongoDB URI → 同样放 `.env.local`（或 `vercel env pull` 拉取）：
  ```ini
  MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
  ```
- `.gitignore` 已含 `*.local`，不会误提交；`.env` 中**不要**放真实密钥。

### 1.3 `package.json` 依赖

```jsonc
{
  "dependencies": {
    "mongodb": "^6.x",        // MongoDB 驱动（后端 Function / 本地脚本用）
    // "@vercel/global-config": "^1.5.1"  ← 若要在 Vite 项目内用 SDK 才需要安装（当前 demo 走 CDN esm.sh，未装）
  }
}
```
- `mongodb` 已加入 `dependencies`，`vite build` 不受影响（仅在 Node 端 / Function 端使用）。
- 前端 Global Config 的 SDK 走浏览器动态 `import('https://esm.sh/@vercel/global-config@1.5.1')`，**零构建依赖**。

### 1.4 `vite.config.js` 关键项

```js
export default defineConfig({
  base: './',                          // 相对路径，子路径部署不挂
  define: { __APP_BUILD_TIME__: JSON.stringify(Date.now()) }, // 注入构建时间戳，用于 PWA 缓存击穿
  plugins: [ vue(), VitePWA({ registerType: 'prompt', /* …manifest + runtimeCaching… */ }) ]
})
```
- 与 GlobalConfig / MongoDB 功能本身无直接耦合，`base` 与 `__APP_BUILD_TIME__` 只服务于 PWA 与故事 JSON 缓存。

### 1.5 `vercel.json`

```json
{ "headers": [ /* 仅给 manifest / sw.js / index.html / icon 设缓存头 */ ] }
```
- 不影响这两个功能；`api/` 目录由 Vercel 自动识别为 Serverless Function。

---

## 2. GlobalConfig 的定义、加载与项目内使用

### 2.1 定义

- **本质**：Vercel 原 Edge Config 改名后的 KV 存储，适合放少量非敏感全局开关/文案。
- **本例数据**：`items: { greeting: "hello world" }`（还有 `digest`、`updatedAt` 元数据）。
- **读取端点**：`https://global-config.vercel.com/<id>?token=<token>`
  - 实测：无/错 token → `401 unauthorized`；正确 → `200`，且 `Access-Control-Allow-Origin: *`（浏览器可直接 fetch）。
- **官方 SDK**：`@vercel/global-config@1.5.1`，导出 `createClient / get / getAll / has / clone / digest`。

### 2.2 加载方式（两种，见 `public/vercel-config.html`）

**方式① 直接 fetch（零依赖，最稳）**
```js
const res = await fetch(conn, { cache: 'no-store' })   // conn = 完整连接字符串
const json = await res.json()
// ⚠️ 注意：直接 fetch 返回 { digest, updatedAt, items }，必须解包到 items 层
const data = json.items !== undefined ? json.items : json
```

**方式② 官方 SDK**
```js
const mod = await import('https://esm.sh/@vercel/global-config@1.5.1')
const client = mod.createClient(conn)        // 浏览器无 process.env，必须显式传 conn
const greeting = await client.get('greeting') // 读单值（README 主示例）
const exists   = await client.has('greeting') // 是否存在
const data     = await client.getAll()         // 全量
```

### 2.3 在项目中的使用

- **测试页（已落地）**：`public/vercel-config.html` → 构建后在 `dist/` 根目录，部署后可通过
  `https://<域名>/vercel-config.html` 静态访问，粘贴连接字符串点按钮即可看到 `greeting` 与全部配置。
- **Vite 项目内集成（参考，尚未落地 `src/lib/globalConfig.js`）**：
  ```js
  // src/lib/globalConfig.js
  import { createClient } from '@vercel/global-config'
  const conn = import.meta.env.VITE_GLOBAL_CONFIG   // Vite 用 VITE_ 前缀
  const client = conn ? createClient(conn) : null
  export const getGreeting = () => client ? client.get('greeting') : null
  export const getAllConfig = () => client ? client.getAll() : {}
  ```
  组件内：`import { getGreeting } from '@/lib/globalConfig'` 后 `await getGreeting()` 即可。

### 2.4 关键配置项与坑

| 要点 | 说明 |
|------|------|
| Token 获取 | 仪表盘 Tokens → Generate Token，关弹窗后不可再查 |
| CORS | 端点 `Access-Control-Allow-Origin: *`，浏览器可直接 fetch |
| 缓存策略 | SDK 默认 `no-store`（每次动态拉，保证最新）；要静态缓存用 `createClient(conn,{cache:'force-cache'})`（可能读旧值） |
| 不可变返回值 | `get/getAll` 返回**不可变对象**，要改值先 `clone()` |
| 包裹结构 | 直接 fetch 是 `{digest,updatedAt,items}`，SDK 的 `getAll()` 只返回 `items` 本身 |
| 只读 | SDK 只能读；写配置要走 Vercel REST API（需 Access Token） |
| 安全 | 连接字符串会出现在客户端代码，**只放非敏感配置** |

---

## 3. MongoDB 连接配置、字符串管理、连接池与错误处理

### 3.1 连接配置

- 连接字符串 `MONGODB_URI` 由 Vercel Native Integration 注入项目环境变量（无需手动填）。
- 格式：`mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`
- 实测可用集群：`sleep-story-db.qrmvsev.mongodb.net`，含库 `test1`（集合 `aaa`）及系统库 `admin`/`local`。

### 3.2 连接字符串管理（核心：不暴露凭据）

- ❌ **禁止前端直连**：URI 含管理员级密码，写进浏览器 JS 即泄露。
- ✅ **后端代理**：Vercel Function 用 `process.env.MONGODB_URI` 读取，前端只调 `/api/mongo-test`。
- 本地验证：`vercel env pull` 拉到 `.env.local`，或 `MONGODB_URI="..." node scripts/mongo-test.mjs`。

### 3.3 连接池 / 超时设置（见 `api/mongo-test.js` 与 `scripts/mongo-test.mjs`）

```js
const client = new MongoClient(uri, {
  connectTimeoutMS: 8000,        // 建连超时
  serverSelectionTimeoutMS: 8000 // 选节点超时
})
```
- **连接池**：`MongoClient` 默认内置连接池（`maxPoolSize` 默认 100）。本 demo 为简单起见每次请求
  新建 client 并在 `finally` 中 `client.close()`；在**高频 Serverless 场景**建议把 client 缓存到
  `globalThis`（避免每次冷启动新建池）：
  ```js
  const g = globalThis
  g._mongo ||= new MongoClient(uri, { ... })
  const client = g._mongo
  // 注意：缓存时不要在 finally 里 close，否则后续请求拿不到连接
  ```
- 超时设 8s，防止卡死无响应。

### 3.4 错误处理机制

| 场景 | 处理 |
|------|------|
| 缺少 `MONGODB_URI` | 返回 `500` + `error` + `hint`（提示 Vercel 自动注入或手动设环境变量） |
| 连接/查询异常 | `try/catch` → `res.status(500).json({ error, stack })` |
| 资源释放 | `finally { await client.close().catch(()=>{}) }` |
| 单库列集合权限不足 | 逐库 `try/catch`，失败时该库标记 `collections: [{ name: '(permission denied)', type:'error' }]` |
| CORS 预检 | 处理函数开头设置 `Access-Control-Allow-Origin: *` 等头，并对 `OPTIONS` 直接 `200` 返回 |

### 3.5 关键代码路径

| 文件 | 角色 | 访问路径 |
|------|------|----------|
| `api/mongo-test.js` | Vercel Serverless Function，列库+集合 | `/api/mongo-test` |
| `scripts/mongo-test.mjs` | 本地 Node 脚本，终端验证 | `node scripts/mongo-test.mjs` |
| `public/mongo-db.html` | 前端测试页，调 Function | `https://<域名>/mongo-db.html` |

`api/mongo-test.js` 核心流程：
```
读 process.env.MONGODB_URI → new MongoClient → client.connect()
→ admin.listDatabases() → 遍历每个库 db.listCollections().toArray()
→ 返回 { ok:true, databases:[{ name, sizeOnDisk, empty, collections:[{name,type}] }] }
```

---

## 4. 启动时加载顺序与依赖关系

### 4.1 二者关系

- **无相互依赖**：GlobalConfig（前端）与 MongoDB（后端 Function）是两条独立链路。
- **无启动时硬依赖**：两者都不在项目构建/启动阶段强制加载，而是**按需运行时触发**。

### 4.2 部署时（Vercel）

1. `git push` → Vercel 拉取仓库。
2. **静态构建**：`vite build` 产出 `dist/`（HTML/JS/CSS/故事 JSON），由 CDN 提供。
3. **Function 识别**：根目录 `api/` 被自动识别为 Serverless Function（`/api/mongo-test`）。
4. **环境变量注入**：
   - `MONGODB_URI`：MongoDB Native Integration 自动注入后端（无需手动）。
   - `VITE_GLOBAL_CONFIG`：需你在 Vercel 项目 Settings → Environment Variables 手动添加（或用 SDK 时）。

### 4.3 运行时加载顺序

```
[用户打开页面]
   └─ 静态资源（HTML/JS/CSS）由 CDN 即时返回（无需等后端）

[GlobalConfig 链路] 用户交互触发
   └─ 点击 vercel-config.html 按钮
        └─ 浏览器 fetch global-config.vercel.com（或直接返回缓存）→ 渲染 greeting

[MongoDB 链路] 用户点击 mongo-db.html「读取」按钮
   └─ 浏览器 fetch /api/mongo-test
        └─ Vercel Function 首次请求 = 冷启动：读 env → 连 Mongo → 列库/集合 → 返回
        └─ 后续请求命中热实例，复用连接池（若已缓存到 globalThis）
```

### 4.4 依赖矩阵

| 维度 | GlobalConfig | MongoDB |
|------|--------------|---------|
| 触发方 | 浏览器（前端） | 浏览器 → Vercel Function（后端） |
| 是否依赖对方 | 否 | 否 |
| 凭据是否暴露前端 | 连接字符串会出现在前端（但仅只读、非敏感） | **绝不暴露**，只在后端 env |
| 启动期是否阻塞 | 否（按需） | 否（按需，Function 冷启动） |
| 关键环境变量 | `VITE_GLOBAL_CONFIG` | `MONGODB_URI` |
| 失败影响范围 | 仅该配置读不到 | 仅该接口 500，不影响静态站点 |

### 4.5 重要提醒

- **CloudStudio（当前静态托管）跑不了 Vercel Function**，所以 MongoDB 在线测试页必须走 Vercel 部署；
  睡前故事 PWA 本身仍可用 CloudStudio 链接，两者不冲突。
- 数据库凭据属敏感信息，**不要**写入代码仓库或工作日志；本地用 `.env.local` 管理。
- 新建 Global Config token 有数秒生效延迟，首次测 `401` 属正常，稍后再试。
