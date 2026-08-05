# 晚安故事屋 · Goodnight Story House

3 岁宝宝专属睡前故事 PWA 应用。暖色温馨界面、好习惯养成主题，支持离线阅读、收藏、夜间模式，可添加到手机主屏幕当 APP 使用。

## 功能

- 9 个原创睡前故事，6 大好习惯主题：按时睡觉 / 刷牙洗手 / 分享礼貌 / 情绪管理 / 安全意识 / 爱护动物
- 每个故事约 4~6 分钟朗读量，语言简单，含重复句与拟声词
- 自动记录上次阅读位置，一键继续
- 收藏夹 + 每日推荐 + 最近阅读
- 睡前夜间模式（低亮度暖色，保护眼睛）
- 正文字号 A-/A+ 可调
- 数据本地存储（localStorage），支持 JSON 导出/导入备份
- PWA：可安装到手机主屏幕，Service Worker 离线可用

## 技术栈

- 纯 HTML + CSS + JS 单文件应用（`index.html` 全内联，零外部依赖）
- PWA：`manifest.webmanifest` + `sw.js`（页面 network-first、静态资源 cache-first）
- 图标：`icon-192.png` / `icon-512.png`（由 `gen_icon.py` 用 Python 标准库生成，无依赖）

## 本地使用

直接双击打开 `index.html` 即可浏览；在线部署（https）后 Service Worker 离线能力才会生效。

## 部署（Vercel）

1. 推送本仓库到 GitHub
2. Vercel 导入项目，Framework Preset 选 Other，无需构建命令
3. `vercel.json` 已配置 manifest 的 Content-Type 与缓存策略

## 数据说明

所有数据保存在用户浏览器 localStorage 中，不上传服务器，隐私安全。
