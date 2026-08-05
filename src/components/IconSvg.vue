<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none"
       :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="svg"></svg>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 },
  color: { type: String, default: 'currentColor' }
})
// 内联 SVG 图标库（零外部依赖）
const P = {
  moon:    '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  tooth:   '<path d="M7 3c-1.5 0-2.5 1-2.5 2.5 0 2 .5 3 .5 6s-1 4-1 6c0 1.5 1 2.5 2.5 2.5 1.5 0 2-1 2.5-2 .5-1 .5-2 .5-3h2c0 1 0 2 .5 3 .5 1 1 2 2.5 2 1.5 0 2.5-1 2.5-2.5 0-2-1-3-1-6s.5-4 .5-6C19 4 18 3 16.5 3 15 3 14.5 4 14 5c-.5 1-1 1.5-2 1.5S9.5 6 9 5C8.5 4 8 3 7 3Z"/>',
  gift:    '<path d="M20 12v8H4v-8M2 7h20v5H2zM12 7v13M12 7S10 3 7.5 3 5 7 12 7zM12 7s2-4 4.5-4S19 7 12 7z"/>',
  smile:   '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  light:   '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11v2h6v-2a6 6 0 0 0-3-11Z"/>',
  paw:     '<circle cx="6" cy="10" r="1.6"/><circle cx="10" cy="7" r="1.6"/><circle cx="14" cy="7" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M12 12c-2.5 0-4.5 2-4.5 3.5S9 19 12 19s4.5-1.5 4.5-3.5S14.5 12 12 12Z"/>',
  heart:   '<path d="M12 20s-7-4.5-9-9c-1.5-3 1-6 3.5-5 1.5.5 2.5 2 2.5 2 .5-1 1-2.5 2.5-2 2.5-1 5 2 3.5 5-2 4.5-9 9-9 9Z"/>',
  star:    '<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z"/>',
  check:   '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  book:    '<path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2V5Zm16 0a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2V5Z"/>',
  sun:     '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users:   '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M16 6a3 3 0 0 1 0 6M21 20c0-3-2-5-5-5"/>',
  spark:   '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M15.5 15.5 18 18M18 6l-2 2M8.5 15.5 6 18"/>',
  home:    '<path d="M4 11l8-7 8 7M6 10v9h12v-9"/>',
  grid:    '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  starFill:'<path fill="currentColor" stroke="none" d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  back:    '<path d="M15 5l-7 7 7 7"/>',
  plus:    '<path d="M12 5v14M5 12h14"/>',
  minus:   '<path d="M5 12h14"/>',
  search:  '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  shield:  '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/>',
  download:'<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
  upload:  '<path d="M12 21V9M7 13l5-5 5 5M4 3h16"/>',
  trash:   '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'
}
const svg = computed(() => P[props.name] || '')
</script>
