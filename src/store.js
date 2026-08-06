import { reactive, ref } from 'vue'
import { STORY_FILES } from './data/categories.js'

const KEYS = {
  fav: 'wb_sleep_fav',
  recent: 'wb_sleep_recent',
  progress: 'wb_sleep_progress',
  settings: 'wb_sleep_settings',
  read: 'wb_sleep_read'
}

function read(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def } catch { return def }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch (e) { console.warn('存储失败', e) }
}

// 全局响应式状态（收藏 / 最近 / 阅读进度 / 设置）
export const state = reactive({
  favorites: read(KEYS.fav, []),
  recent: read(KEYS.recent, []),
  progress: read(KEYS.progress, {}),
  settings: read(KEYS.settings, { night: false, fontSize: 16, tip: false }),
  readAt: read(KEYS.read, {}) // 已读记录：{ [storyId]: 时间戳 }
})

// 故事列表（运行时从 JSON 加载）
export const stories = ref([])
export const loaded = ref(false)

// 首页点击分类卡片时，传递“待选中分类”给分类页（用于锚点跳转）
export const pendingCat = ref(null)
export function setPendingCat(id) { pendingCat.value = id }

const CACHE_BUST = typeof __APP_BUILD_TIME__ !== 'undefined' ? `?v=${__APP_BUILD_TIME__}` : ''

export function loadStories() {
  return Promise.all(
    STORY_FILES.map(f =>
      fetch(`./stories/${f}.json${CACHE_BUST}`).then(r => r.ok ? r.json() : { stories: [] })
        .catch(() => ({ stories: [] }))
    )
  ).then(arrs => {
    const all = []
    const seen = new Set()
    arrs.forEach(a => {
      if (a && Array.isArray(a.stories)) {
        a.stories.forEach(s => { if (!seen.has(s.id)) { seen.add(s.id); all.push(s) } })
      }
    })
    stories.value = all
    loaded.value = true
    return all
  })
}

export const storyById = id => stories.value.find(s => s.id === id) || null

// ===== 收藏 =====
export const isFav = id => state.favorites.includes(id)
export function toggleFav(id) {
  const i = state.favorites.indexOf(id)
  if (i >= 0) state.favorites.splice(i, 1)
  else state.favorites.unshift(id)
  write(KEYS.fav, state.favorites)
}

// ===== 最近阅读 =====
export function addRecent(id) {
  state.recent = [id, ...state.recent.filter(x => x !== id)].slice(0, 12)
  write(KEYS.recent, state.recent)
}

// ===== 已读记录（完整阅读历史，不限额） =====
export const isRead = id => !!state.readAt[id]
export function markRead(id) {
  if (!id) return
  state.readAt[id] = Date.now()
  write(KEYS.read, state.readAt)
}
// 已读列表：按阅读时间倒序返回故事对象
export function readList() {
  return Object.keys(state.readAt)
    .sort((a, b) => state.readAt[b] - state.readAt[a])
    .map(id => storyById(id))
    .filter(Boolean)
}

// ===== 阅读进度（自动记录滚动位置） =====
export const getProgress = id => state.progress[id] || null
export function setProgress(id, p) {
  state.progress[id] = p
  write(KEYS.progress, state.progress)
}

// ===== 设置 =====
export function saveSettings(patch) {
  state.settings = { ...state.settings, ...patch }
  write(KEYS.settings, state.settings)
  applyNight()
}
export function applyNight() {
  if (state.settings.night) document.documentElement.setAttribute('data-night', '1')
  else document.documentElement.removeAttribute('data-night')
}

// ===== 备份导出 / 导入 / 清空 =====
export function exportBackup() {
  const data = {
    app: '晚安故事屋',
    version: 2,
    exportedAt: new Date().toISOString(),
    favorites: state.favorites,
    recent: state.recent,
    progress: state.progress,
    settings: state.settings,
    readAt: state.readAt
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '晚安故事屋-备份.json'
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(a.href)
}
export function importBackup(text) {
  const d = JSON.parse(text)
  if (Array.isArray(d.favorites)) { state.favorites = d.favorites; write(KEYS.fav, state.favorites) }
  if (Array.isArray(d.recent)) { state.recent = d.recent; write(KEYS.recent, state.recent) }
  if (d.progress && typeof d.progress === 'object') { state.progress = d.progress; write(KEYS.progress, d.progress) }
  if (d.settings && typeof d.settings === 'object') { state.settings = d.settings; write(KEYS.settings, d.settings); applyNight() }
  if (d.readAt && typeof d.readAt === 'object') { state.readAt = d.readAt; write(KEYS.read, state.readAt) }
  return true
}
export function clearAll() {
  state.favorites = []; state.recent = []; state.progress = {}; state.readAt = {}
  write(KEYS.fav, []); write(KEYS.recent, []); write(KEYS.progress, {}); write(KEYS.read, {})
}
