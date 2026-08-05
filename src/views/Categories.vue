<template>
  <div>
    <div class="sec-title"><h3>好习惯 &amp; 主题分类</h3></div>
    <div class="cat-grid">
      <CategoryCard v-for="c in CATS" :key="c.id" :cat="c" :count="countByCat[c.id] || 0" @select="pick" />
    </div>

    <div class="sec-title" v-if="selected">
      <h3>{{ catName(selected) }} · {{ filtered.length }} 篇</h3>
      <span class="more" @click="selected = null">显示全部</span>
    </div>
    <div class="sec-title" v-else><h3>全部故事 · {{ stories.length }} 篇</h3></div>

    <StoryCard v-for="s in filtered" :key="s.id" :story="s" @open="open" />
    <div class="empty" v-if="!filtered.length">这个分类还没有故事哦～</div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import CategoryCard from '../components/CategoryCard.vue'
import StoryCard from '../components/StoryCard.vue'
import { stories } from '../store.js'
import { CATS, catName } from '../data/categories.js'

const open = inject('openStory')
const selected = ref(null)

const countByCat = computed(() => {
  const m = {}
  stories.value.forEach(s => { m[s.category] = (m[s.category] || 0) + 1 })
  return m
})
const filtered = computed(() =>
  selected.value ? stories.value.filter(s => s.category === selected.value) : stories.value
)
function pick(id) { selected.value = (selected.value === id) ? null : id; window.scrollTo(0, 0) }
</script>

<style scoped>
.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.empty{padding:40px 0;text-align:center;color:var(--text2);font-size:14px}
</style>
