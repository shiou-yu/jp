<template>
  <v-app>
    <v-app-bar flat color="white" border>
      <v-container class="d-flex align-center">
        <v-app-bar-title
          class="brand-font font-weight-bold"
          style="cursor: pointer"
          @click="$router.push('/')"
        >
          日本超商精選
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <div class="d-none d-md-flex">
          <v-btn variant="text" class="nav-btn" to="/">首頁</v-btn>
          <v-btn variant="text" class="nav-btn" to="/cart">收藏清單</v-btn>
          <v-btn variant="text" class="nav-btn" to="/login">登入</v-btn>
        </div>

        <v-btn icon="mdi-menu" class="d-md-none"></v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <div class="cursor-dot" :style="dotStyle"></div>
    <div class="cursor-pudding" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

// --- 滑鼠特效邏輯 ---
const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
const scale = ref(1)

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    const deltaX = e.clientX - mouse.value.x
    rotation.value = deltaX * 0.5
    mouse.value.x = e.clientX
    mouse.value.y = e.clientY
  })

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
/* --- 全域樣式區 --- */

/* 1. 強制覆蓋 Vuetify 的預設字體 */
.v-application {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

/* 2. 隱藏原生滑鼠 */
html, body {
  cursor: none !important;
  overflow-x: hidden; /* 防止捲軸閃爍 */
}

/* 3. 字體設定 */
h1, h2, h3, .brand-title, .nav-btn, .v-btn {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
}

/* 確保所有互動元件在隱藏滑鼠時，不會變成系統預設游標 */
a, button, .v-btn {
  cursor: none !important;
}
</style>

<style scoped>
/* --- 特效樣式區 --- */

.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;

  /* ⚠️ 關鍵：讓點擊穿透圓點，這樣才點得到按鈕 */
  pointer-events: none !important;

  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;

  /* ⚠️ 關鍵：讓點擊穿透圖片，這樣才點得到按鈕 */
  pointer-events: none !important;

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
