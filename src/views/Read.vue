<template>
  <div>
    <div class="sec-title">
      <h3>📖 读过的故事</h3>
      <span class="more" v-if="list.length">{{ list.length }} 篇</span>
    </div>

    <div class="banner" v-if="!list.length">
      <IconSvg name="book" :size="20" />
      <span>打开任意故事读给宝宝听，就会自动记在这里啦～</span>
    </div>

    <StoryCard
      v-for="item in list"
      :key="item.s.id"
      :story="item.s"
      :readAt="item.at"
      @open="open"
    />

    <div class="empty" v-if="list.length">已经是读过的全部故事啦 🌟</div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import IconSvg from '../components/IconSvg.vue'
import StoryCard from '../components/StoryCard.vue'
import { state, readList } from '../store.js'

const open = inject('openStory')

// readList() 已按阅读时间倒序返回故事对象；这里带上时间戳用于卡片显示
const list = computed(() => readList().map(s => ({ s, at: state.readAt[s.id] })))
</script>

<style scoped>
.empty{padding:18px 0 28px;text-align:center;color:var(--text2);font-size:13px}
</style>
