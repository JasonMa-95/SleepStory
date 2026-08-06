import { createApp, ref } from 'vue'
import App from './App.vue'
import './styles.css'

// 暴露 PWA 更新状态给 App.vue，用于显示「发现新版本，点击刷新」提示
export const swNeedRefresh = ref(false)
export const swOfflineReady = ref(false)
export const swUpdateFn = ref(null)

const app = createApp(App)
app.mount('#app')

// vite-plugin-pwa 提供的虚拟模块：手动接管 Service Worker 更新
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        swNeedRefresh.value = true
      },
      onOfflineReady() {
        swOfflineReady.value = true
      }
    })
    swUpdateFn.value = updateSW
  }).catch(() => {
    // 虚拟模块仅在 PWA 构建时存在；开发环境可能不存在，忽略错误
  })
}
