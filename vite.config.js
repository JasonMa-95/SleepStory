import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// 相对路径 base，保证子路径部署也不挂
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',          // 改完故事重新部署，用户手机自动更新
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: '晚安故事屋',
        short_name: '晚安故事屋',
        description: '3岁宝宝睡前故事：好习惯养成主题，暖色温馨，离线可用',
        theme_color: '#E8915F',
        background_color: '#FFF5E6',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json,webmanifest}'],
        // 故事 JSON 走 network-first：既能离线，又能拿到最新内容
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/stories/'),
            handler: 'NetworkFirst',
            options: { cacheName: 'story-json', networkTimeoutSeconds: 6 }
          }
        ]
      }
    })
  ]
})
