<template>
  <div>
    <div class="sec-title"><h3>我的设置</h3></div>

    <div class="card">
      <div class="row" @click="toggleNight">
        <span class="row-ico"><IconSvg :name="state.settings.night ? 'sun' : 'moon'" :size="22" /></span>
        <span class="row-label">夜间模式（睡前更柔和）</span>
        <span class="switch" :class="{ on: state.settings.night }"><i></i></span>
      </div>
      <div class="row">
        <span class="row-ico"><IconSvg name="book" :size="22" /></span>
        <span class="row-label">正文字号</span>
        <span class="fs-ctrl">
          <button class="icon-btn sm" @click="dec" aria-label="缩小"><IconSvg name="minus" :size="18" /></button>
          <b>{{ state.settings.fontSize }}</b>
          <button class="icon-btn sm" @click="inc" aria-label="放大"><IconSvg name="plus" :size="18" /></button>
        </span>
      </div>
    </div>

    <div class="sec-title"><h3>数据备份</h3></div>
    <div class="card">
      <p class="tip-line"><IconSvg name="shield" :size="18" /> 收藏与阅读进度只存在本机，建议定期备份</p>
      <button class="btn btn-primary btn-block" @click="exportBackup">
        <IconSvg name="download" :size="18" color="#fff" /> 导出 JSON 备份
      </button>
      <button class="btn btn-ghost btn-block" @click="pickFile">
        <IconSvg name="upload" :size="18" /> 导入恢复备份
      </button>
      <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="onFile" />
      <button class="btn btn-danger btn-block" @click="askClear">
        <IconSvg name="trash" :size="18" color="#fff" /> 清空所有数据
      </button>
    </div>

    <div class="sec-title"><h3>关于</h3></div>
    <div class="card about">
      <div class="about-line">晚安故事屋 v2.0 · Vue 3 + PWA</div>
      <div class="about-line">已收录 {{ stories.length }} 个原创睡前故事</div>
      <div class="about-line">数据保存在本机浏览器，不上传服务器</div>
    </div>

    <!-- 清空确认 -->
    <div class="modal-mask" v-if="showClear" @click.self="showClear = false">
      <div class="modal">
        <h4>确定要清空吗？</h4>
        <p>将删除全部收藏、阅读记录和进度，<br>且无法恢复。建议先导出备份。</p>
        <div class="row">
          <button class="btn btn-ghost flex1" @click="showClear = false">再想想</button>
          <button class="btn btn-danger flex1" @click="doClear">确认清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import IconSvg from '../components/IconSvg.vue'
import { state, stories, applyNight, saveSettings, exportBackup, importBackup, clearAll } from '../store.js'

const fileInput = ref(null)
const showClear = ref(false)

function toggleNight() { state.settings.night = !state.settings.night; applyNight() }
function dec() { saveSettings({ fontSize: Math.max(16, state.settings.fontSize - 2) }) }
function inc() { saveSettings({ fontSize: Math.min(32, state.settings.fontSize + 2) }) }

function pickFile() { fileInput.value.click() }
function onFile(e) {
  const f = e.target.files[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    try { importBackup(reader.result); alert('备份恢复成功！') }
    catch (err) { alert('文件格式不正确，恢复失败') }
  }
  reader.readAsText(f)
  e.target.value = ''
}
function askClear() { showClear.value = true }
function doClear() { clearAll(); showClear.value = false; alert('已清空所有数据') }
</script>

<style scoped>
.row{display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:none}
.row-ico{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  background:var(--card2);color:var(--primary)}
.row-label{flex:1;font-size:15px;font-weight:600;color:var(--text)}
.switch{width:50px;height:30px;border-radius:999px;background:var(--line);position:relative;transition:background .2s;flex:none}
.switch i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.switch.on{background:var(--ok)}
.switch.on i{left:23px}
.fs-ctrl{display:flex;align-items:center;gap:10px}
.fs-ctrl b{min-width:22px;text-align:center}
.fs-ctrl .icon-btn.sm{width:36px;height:36px;border-radius:10px}
.tip-line{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);margin-bottom:14px}
.card .btn{margin-bottom:10px}
.card .btn:last-child{margin-bottom:0}
.about-line{font-size:13px;color:var(--text2);line-height:1.9}
.flex1{flex:1}
</style>
