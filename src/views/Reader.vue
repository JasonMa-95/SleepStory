<template>
  <div class="reader" v-if="story" :style="{ '--fs': state.settings.fontSize + 'px' }">
    <div class="reader-bar">
      <button class="icon-btn sm" @click="back" aria-label="返回"><IconSvg name="back" :size="22" /></button>
      <div class="rt">{{ catName(story.category) }}</div>
      <button class="icon-btn sm" @click="toggleFav(story.id)" :class="{ on: isFav(story.id) }" aria-label="收藏">
        <IconSvg :name="isFav(story.id) ? 'starFill' : 'star'" :size="20" :color="isFav(story.id) ? 'var(--star)' : ''" />
      </button>
    </div>

    <h1 class="rtitle">{{ story.title }}</h1>
    <div class="rmeta">⏱ 约 {{ story.minutes }} 分钟 · {{ (story.tags || []).join(' · ') }}</div>

    <article>
      <p v-for="(p, i) in story.paras" :key="i" :class="{ end: i === story.paras.length - 1 }">{{ p }}</p>
    </article>

    <div class="reader-end">🌙 今天的故事讲完啦，晚安，我的小宝贝！</div>

    <div class="fs-bar">
      <span class="fs-label">字号</span>
      <button class="icon-btn sm" @click="dec" aria-label="缩小"><IconSvg name="minus" :size="20" /></button>
      <span class="fs-val">{{ state.settings.fontSize }}</span>
      <button class="icon-btn sm" @click="inc" aria-label="放大"><IconSvg name="plus" :size="20" /></button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, inject } from 'vue'
import IconSvg from '../components/IconSvg.vue'
import { state, getProgress, setProgress, isFav, toggleFav, saveSettings } from '../store.js'
import { catName } from '../data/categories.js'

const props = defineProps({ story: Object })
const back = inject('back')

let scrollTimer = null
function save() { setProgress(props.story.id, { y: window.scrollY, at: Date.now() }) }
function onScroll() { clearTimeout(scrollTimer); scrollTimer = setTimeout(save, 400) }

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
  await nextTick()
  const p = getProgress(props.story.id)
  if (p && p.y) setTimeout(() => window.scrollTo(0, p.y), 80)
})
onUnmounted(() => { window.removeEventListener('scroll', onScroll); save() })

function dec() { saveSettings({ fontSize: Math.max(16, state.settings.fontSize - 2) }) }
function inc() { saveSettings({ fontSize: Math.min(32, state.settings.fontSize + 2) }) }
</script>

<style scoped>
.reader-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.reader-bar .icon-btn.sm{width:42px;height:42px;border-radius:13px}
.reader-bar .icon-btn.on{color:var(--star)}
.rt{font-size:14px;font-weight:700;color:var(--text2)}
.rtitle{font-size:25px;font-weight:800;color:var(--text);line-height:1.35;margin-bottom:8px}
.rmeta{font-size:13px;color:var(--text2);margin-bottom:18px}
article p{font-size:var(--fs);line-height:2;color:var(--text);margin-bottom:18px;text-align:justify;letter-spacing:.3px}
article p.end{color:var(--deep);font-weight:600}
.reader-end{text-align:center;color:var(--primary);font-weight:700;font-size:16px;margin:10px 0 24px}
.fs-bar{position:sticky;bottom:calc(var(--tabbar-h) + 10px);display:flex;align-items:center;justify-content:center;gap:14px;
  background:color-mix(in srgb,var(--card) 95%,transparent);backdrop-filter:blur(8px);
  border:1px solid var(--line);border-radius:16px;padding:8px 16px;box-shadow:var(--shadow);max-width:240px;margin:0 auto}
.fs-label{font-size:13px;color:var(--text2);font-weight:600}
.fs-val{font-size:15px;font-weight:700;min-width:26px;text-align:center}
.fs-bar .icon-btn.sm{width:38px;height:38px;border-radius:11px}
</style>
