<template>
  <div class="header">
    <div class="logo">
      <span class="moon-pill"><IconSvg name="moon" :size="22" color="#fff" /></span>
      <div><h1>晚安故事屋</h1><small>SWEET DREAMS</small></div>
    </div>
    <button class="icon-btn" @click="toggleNight" :aria-label="state.settings.night ? '日间模式' : '夜间模式'">
      <IconSvg :name="state.settings.night ? 'sun' : 'moon'" :size="22" />
    </button>
  </div>

  <!-- 发现新版本提示 -->
  <div v-if="swNeedRefresh" class="update-bar">
    <span>发现新版本（{{ stories.length }} 篇故事），点击刷新获取最新内容</span>
    <button @click="doReload">立即刷新</button>
  </div>

  <main class="main">
    <div v-if="!loaded" class="loading">🌙 正在点亮小星星…</div>
    <Home v-else-if="view === 'home'" class="view" />
    <Categories v-else-if="view === 'categories'" class="view" />
    <Favorites v-else-if="view === 'favorites'" class="view" />
    <Settings v-else-if="view === 'settings'" class="view" />
    <Reader v-else-if="view === 'reader'" class="view" :story="currentStory" />
  </main>

  <nav class="tabbar">
    <button v-for="t in tabs" :key="t.id" :class="{ active: view === t.id }" @click="go(t.id)">
      <IconSvg :name="t.icon" :size="24" />
      <span>{{ t.name }}</span>
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import { state, loaded, stories, loadStories, applyNight, addRecent, storyById } from './store.js'
import { swNeedRefresh, swUpdateFn } from './main.js'
import IconSvg from './components/IconSvg.vue'
import Home from './views/Home.vue'
import Categories from './views/Categories.vue'
import Favorites from './views/Favorites.vue'
import Settings from './views/Settings.vue'
import Reader from './views/Reader.vue'

const view = ref('home')
const lastTab = ref('home')
const readerId = ref(null)
const tabs = [
  { id: 'home', name: '首页', icon: 'home' },
  { id: 'categories', name: '分类', icon: 'grid' },
  { id: 'favorites', name: '收藏', icon: 'star' },
  { id: 'settings', name: '我的', icon: 'settings' }
]

const currentStory = computed(() => storyById(readerId.value))

function go(v) { lastTab.value = v; view.value = v; window.scrollTo(0, 0) }
function doReload() {
  if (swUpdateFn.value) swUpdateFn.value(true)
  else window.location.reload()
}
function openStory(id) {
  if (view.value !== 'reader') lastTab.value = view.value
  addRecent(id); readerId.value = id; view.value = 'reader'; window.scrollTo(0, 0)
}
function back() { view.value = lastTab.value || 'home'; window.scrollTo(0, 0) }
function toggleNight() { state.settings.night = !state.settings.night; applyNight() }

provide('openStory', openStory)
provide('back', back)
provide('goTab', go)

onMounted(() => { applyNight(); loadStories() })
</script>

<style scoped>
.update-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #FFF8E8;
  border-bottom: 1px solid #FFE4C2;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  color: #8B5A2B;
}
.update-bar button {
  flex-shrink: 0;
  background: #E8915F;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
}
</style>
