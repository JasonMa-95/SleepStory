<template>
  <button class="cat-card" :style="{ '--c': cat.color }" @click="$emit('select', cat.id)">
    <span class="cat-ico"><IconSvg :name="cat.icon" :size="26" /></span>
    <span class="cat-name">{{ cat.name }}</span>
    <span class="cat-desc">{{ cat.desc }}</span>
    <span class="cat-count" v-if="count !== undefined">{{ count }} 篇</span>
  </button>
</template>
<script setup>
import IconSvg from './IconSvg.vue'
defineProps({ cat: Object, count: Number })
defineEmits(['select'])
</script>
<style scoped>
.cat-card{display:flex;flex-direction:column;align-items:flex-start;gap:4px;text-align:left;
  background:var(--card);border-radius:18px;padding:16px;box-shadow:var(--shadow);position:relative;overflow:hidden;transition:transform .12s}
.cat-card:active{transform:scale(.97)}
.cat-card::before{content:'';position:absolute;right:-18px;top:-18px;width:68px;height:68px;border-radius:50%;background:var(--c);opacity:.12}
.cat-ico{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;
  background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
.cat-name{font-size:16px;font-weight:700;color:var(--text);margin-top:2px}
.cat-desc{font-size:12px;color:var(--text2)}
.cat-count{position:absolute;right:14px;bottom:12px;font-size:11px;color:var(--c);font-weight:700}
</style>
