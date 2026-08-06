<template>
  <div class="story-card" :class="{ read: isRead(story.id) }" @click="$emit('open', story.id)">
    <div class="sc-top">
      <div class="sc-left">
        <span class="tag" :style="{ background: catColor(story.category) + '22', color: catColor(story.category) }">
          {{ catName(story.category) }}
        </span>
        <span class="read-badge" v-if="isRead(story.id)">
          <IconSvg name="check" :size="12" /> 已读
        </span>
      </div>
      <button class="fav" :class="{ on: isFav(story.id) }" @click.stop="toggleFav(story.id)"
              :aria-label="isFav(story.id) ? '取消收藏' : '收藏'">
        <IconSvg :name="isFav(story.id) ? 'starFill' : 'star'" :size="20" />
      </button>
    </div>
    <h4>{{ story.title }}</h4>
    <div class="sc-meta">⏱ 约{{ story.minutes }}分钟 · {{ (story.tags || []).slice(0, 3).join(' · ') }}</div>
    <div class="sc-read" v-if="readAt">读于 {{ fmt(readAt) }}</div>
  </div>
</template>
<script setup>
import IconSvg from './IconSvg.vue'
import { isFav, toggleFav, isRead } from '../store.js'
import { catName, catColor } from '../data/categories.js'
defineProps({ story: Object, readAt: Number })
defineEmits(['open'])

function fmt(ts) {
  const d = new Date(ts), now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const y = new Date(now); y.setDate(now.getDate() - 1)
  const isYest = d.toDateString() === y.toDateString()
  if (sameDay) return '今天'
  if (isYest) return '昨天'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
</script>
<style scoped>
.story-card{background:var(--card);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow);margin-bottom:12px;transition:transform .12s;cursor:pointer}
.story-card.read{border:1px solid color-mix(in srgb,var(--ok) 45%,transparent)}
.story-card:active{transform:scale(.98)}
.sc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.sc-left{display:flex;align-items:center;gap:8px;min-width:0}
.tag{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;flex:none}
.read-badge{display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:700;color:var(--ok);
  background:color-mix(in srgb,var(--ok) 16%,transparent);padding:2px 8px;border-radius:999px;flex:none}
.fav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--text2);flex:none}
.fav.on{color:var(--star)}
.story-card h4{font-size:17px;font-weight:700;color:var(--text);margin-bottom:6px;line-height:1.4}
.sc-meta{font-size:12.5px;color:var(--text2)}
.sc-read{font-size:11.5px;color:var(--ok);font-weight:600;margin-top:4px}
</style>
