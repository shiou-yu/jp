<template>
  <v-app>
    <div class="cursor-dot" :style="dotStyle"></div>
    <div class="cursor-pudding" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <router-view />
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
const scale = ref(1)

// 滑鼠移動監聽
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    const deltaX = e.clientX - mouse.value.x
    rotation.value = deltaX * 0.5
    mouse.value.x = e.clientX
    mouse.value.y = e.clientY
  })

  // 點擊 Q 彈效果
  window.addEventListener('mousedown', () => scale.value = 0.8)
  window.addEventListener('mouseup', () => scale.value = 1)
}

const update = () => {
  puddingPos.value.x += (mouse.value.x - puddingPos.value.x) * 0.15
  puddingPos.value.y += (mouse.value.y - puddingPos.value.y) * 0.15
  requestAnimationFrame(update)
}

const puddingStyle = computed(() => ({
  transform: `translate(${puddingPos.value.x}px, ${puddingPos.value.y}px)
              rotate(${rotation.value}deg)
              scale(${scale.value})`,
}))

const dotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
}))

onMounted(() => update())
</script>

<style>
/* --- 全域樣式區 (無 scoped，確保字體生效) --- */

/* 1. 強制覆蓋 Vuetify 的預設字體 */
.v-application {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

/* 2. 隱藏原生滑鼠 */
html, body {
  cursor: none !important;
}

/* 3. 讓所有標題預設繼承圓體並加粗 */
h1, h2, h3, .brand-title {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
}

/* 讓按鈕等組件也強制換字體 */
.v-btn, .v-card-title, .v-list-item-title {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}
</style>

<style scoped>
/* --- 元件專用樣式區 (不影響字體) --- */

.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  pointer-events: none;
  z-index: 9999;
  margin-top: -22px;
  margin-left: -22px;
  transition: transform 0.1s ease-out;
}

.cursor-pudding img {
  width: 100%;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}
</style>

壞掉ㄑㄧ
