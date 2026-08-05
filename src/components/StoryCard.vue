<template>
  <div class="story-card" @click="$emit('open', story.id)">
    <div class="sc-top">
      <span class="tag" :style="{ background: catColor(story.category) + '22', color: catColor(story.category) }">
        {{ catName(story.category) }}
      </span>
      <button class="fav" :class="{ on: isFav(story.id) }" @click.stop="toggleFav(story.id)"
              :aria-label="isFav(story.id) ? '取消收藏' : '收藏'">
        <IconSvg :name="isFav(story.id) ? 'starFill' : 'star'" :size="20" />
      </button>
    </div>
    <h4>{{ story.title }}</h4>
    <div class="sc-meta">⏱ 约{{ story.minutes }}分钟 · {{ (story.tags || []).slice(0, 3).join(' · ') }}</div>
  </div>
</template>
<script setup>
import IconSvg from './IconSvg.vue'
import { isFav, toggleFav } from '../store.js'
import { catName, catColor } from '../data/categories.js'
defineProps({ story: Object })
defineEmits(['open'])
</script>
<style scoped>
.story-card{background:var(--card);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow);margin-bottom:12px;transition:transform .12s;cursor:pointer}
.story-card:active{transform:scale(.98)}
.sc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.tag{font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px}
.fav{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--text2)}
.fav.on{color:var(--star)}
.story-card h4{font-size:17px;font-weight:700;color:var(--text);margin-bottom:6px;line-height:1.4}
.sc-meta{font-size:12.5px;color:var(--text2)}
</style>
