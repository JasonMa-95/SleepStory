<template>
  <div>
    <!-- 继续阅读 -->
    <div class="card continue" v-if="continueStory">
      <div class="c-head"><IconSvg name="book" :size="20" color="var(--primary)" /><b>继续读下去</b></div>
      <p>《{{ continueStory.title }}》读到一半啦</p>
      <button class="btn btn-primary btn-block" @click="open(continueStory.id)">继续阅读 →</button>
    </div>

    <!-- 添加桌面提示 -->
    <div class="banner" v-if="!state.settings.tip">
      <IconSvg name="star" :size="20" />
      <span>想把它装到手机桌面当APP？点浏览器「分享」→「添加到主屏幕」</span>
      <button class="x" @click="closeTip"><IconSvg name="back" :size="16" style="transform:rotate(45deg)" /></button>
    </div>

    <!-- 今晚推荐 -->
    <div class="sec-title"><h3>🌟 今晚推荐</h3></div>
    <div class="card tonight" v-if="today.id">
      <span class="tag" :style="{ background: catColor(today.category) + '22', color: catColor(today.category) }">
        {{ catName(today.category) }}
      </span>
      <h4>{{ today.title }}</h4>
      <p class="meta">约 {{ today.minutes }} 分钟 · {{ (today.tags || []).slice(0, 2).join(' · ') }}</p>
      <button class="btn btn-ghost" @click="open(today.id)">读这篇</button>
    </div>

    <!-- 最近阅读 -->
    <template v-if="recentStories.length">
      <div class="sec-title"><h3>最近读过</h3><span class="more" @click="goTab('favorites')">我的收藏</span></div>
      <StoryCard v-for="s in recentStories" :key="s.id" :story="s" @open="open" />
    </template>

    <!-- 好习惯分类 -->
    <div class="sec-title"><h3>按好习惯找故事</h3><span class="more" @click="goTab('categories')">更多</span></div>
    <div class="cat-grid">
      <CategoryCard v-for="c in firstCats" :key="c.id" :cat="c" :count="countByCat[c.id] || 0" @select="openCategory" />
    </div>

    <div class="sec-title"><h3>全部故事</h3><span class="more" @click="goTab('categories')">{{ stories.length }} 篇</span></div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import IconSvg from '../components/IconSvg.vue'
import StoryCard from '../components/StoryCard.vue'
import CategoryCard from '../components/CategoryCard.vue'
import { stories, state, saveSettings, setPendingCat } from '../store.js'
import { CATS, catName, catColor } from '../data/categories.js'

const open = inject('openStory')
const goTab = inject('goTab')

// 首页点分类卡片：记下待选中分类，跳到分类页后自动选中并锚点跳转
function openCategory(id) { setPendingCat(id); goTab('categories') }

const countByCat = computed(() => {
  const m = {}
  stories.value.forEach(s => { m[s.category] = (m[s.category] || 0) + 1 })
  return m
})
const firstCats = CATS.slice(0, 6)

const continueStory = computed(() => {
  for (const id of state.recent) {
    if (state.progress[id]) return stories.value.find(s => s.id === id) || null
  }
  return null
})
const recentStories = computed(() =>
  state.recent.map(id => stories.value.find(s => s.id === id)).filter(Boolean).slice(0, 5)
)
const today = computed(() => {
  const list = stories.value
  if (!list.length) return { id: '', title: '', category: 'sleep', minutes: 5, tags: [] }
  const day = new Date().getDate()
  return list[(day - 1) % list.length]
})
function closeTip() { saveSettings({ tip: true }) }
</script>

<style scoped>
.continue .c-head{display:flex;align-items:center;gap:8px;color:var(--text);margin-bottom:6px}
.continue p{font-size:14px;color:var(--text2);margin-bottom:12px}
.tonight .tag{display:inline-block;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:8px}
.tonight h4{font-size:19px;font-weight:700;margin-bottom:6px}
.tonight .meta{font-size:13px;color:var(--text2);margin-bottom:12px}
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
</style>
