<template>
  <div>
    <div class="sec-title"><h3>❤ 我的收藏</h3><span class="more" v-if="list.length">{{ list.length }} 篇</span></div>
    <div class="banner" v-if="!list.length">
      <IconSvg name="heart" :size="20" />
      <span>在故事里点右上角的小星星，就能把宝宝喜欢的故事收进来啦</span>
    </div>
    <StoryCard v-for="s in list" :key="s.id" :story="s" @open="open" />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import IconSvg from '../components/IconSvg.vue'
import StoryCard from '../components/StoryCard.vue'
import { state, storyById } from '../store.js'

const open = inject('openStory')
const list = computed(() => state.favorites.map(id => storyById(id)).filter(Boolean))
</script>
