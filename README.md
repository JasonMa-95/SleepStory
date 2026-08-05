# 晚安故事屋 · Goodnight Story House

3 岁宝宝专属睡前故事 PWA 应用。暖色温馨界面、好习惯养成主题，支持离线阅读、收藏、夜间模式，可添加到手机主屏幕当 APP 使用。

## 功能

- **113 篇原创睡前故事**，14 大主题：
  - 好习惯养成：按时睡觉 / 刷牙洗手 / 分享礼貌 / 情绪管理 / 安全意识 / 爱护动物
  - 品格教育：诚实 / 勇气 / 责任感
  - 成长培养：学习习惯 / 生活习惯 / 时间管理 / 人际交往（同理心）/ 科学启蒙
- 每个故事约 4~6 分钟朗读量，语言简单，含重复句与拟声词，结尾带温柔「晚安」
- 自动记录上次阅读位置，一键继续
- 收藏夹 + 每日推荐 + 最近阅读
- 睡前夜间模式（低亮度暖色，保护眼睛）
- 正文字号 A-/A+ 可调
- 数据本地存储（localStorage），支持 JSON 导出/导入备份
- PWA：可安装到手机主屏幕，Service Worker 离线可用，更新自动生效

## 技术栈

- **Vue 3 + Vite** 组件化工程
- **vite-plugin-pwa**：自动生成 manifest + Service Worker（`autoUpdate` 自动更新，故事 JSON 走 network-first 策略，离线也能读、联网即更新）
- 故事内容外置为 `public/stories/*.json`（静态数据，与代码解耦，方便单独增改）
- 用户数据（收藏 / 阅读进度 / 设置）保存在浏览器 `localStorage`

## 目录结构

```
sleep-story/
├── index.html              # Vite 入口
├── vite.config.js          # 含 VitePWA 配置
├── public/
│   ├── icon-192.png        # PWA 图标
│   ├── icon-512.png
│   └── stories/            # 故事 JSON（base + 8 主题）
│       ├── base.json       # 原 9 篇（6 大好习惯）
│       ├── honest.json     # 诚实
│       ├── courage.json    # 勇气
│       ├── responsibility.json # 责任感
│       ├── study.json      # 学习习惯
│       ├── life.json       # 生活习惯
│       ├── time.json       # 时间管理
│       ├── friendship.json # 人际交往
│       └── science.json    # 科学启蒙
├── src/
│   ├── App.vue             # 外壳 + 底部导航
│   ├── main.js
│   ├── store.js            # localStorage 封装
│   ├── data/categories.js  # 分类与图标
│   ├── components/         # IconSvg / StoryCard / CategoryCard
│   └── views/             # Home / Categories / Reader / Favorites / Settings
├── validate.mjs            # 故事 JSON 校验脚本
└── vercel.json             # manifest/sw 的 Content-Type 与缓存策略
```

## 本地开发

```bash
npm install
npm run dev        # 本地开发预览
npm run build      # 构建到 dist/（Vercel 部署用此产物）
npm run preview    # 本地预览构建产物
```

## 部署（Vercel）

1. 推送本仓库到 GitHub
2. 打开 vercel.com，用 GitHub 登录 → Add New → Project → 导入本仓库
3. Framework Preset 选 **Vite**（会自动识别），Build Command `npm run build`，Output Directory `dist` —— 全部默认即可，无需手动填
4. 点击 Deploy，得到 `https://xxx.vercel.app`
5. 手机浏览器打开 → 添加到主屏幕 → 像 APP 一样使用

> 之后更新故事：改 `public/stories/*.json` 或代码，`git push` 后 Vercel 自动重新构建部署；Service Worker 的 autoUpdate 会让用户手机自动拿到新内容。

## 数据说明

所有数据保存在用户浏览器 localStorage 中，不上传服务器，隐私安全。建议偶尔到「我的」页导出备份。
