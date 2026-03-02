<template>
  <v-app>
    <v-app-bar flat border color="white">
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
/* 全域樣式：確保字體生效 */
.v-application {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

html, body {
  cursor: none !important;
}

.brand-font, .nav-btn, h1, h2, h3 {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-weight: 700 !important;
}

/* 讓按鈕在滑鼠懸停時顯示為手型（雖然你隱藏了原生滑鼠，但這有助於無障礙與邏輯） */
.v-btn, .cursor-pointer {
  cursor: none !important;
}
</style>

<style scoped>
.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none; /* 穿透點擊 */
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  pointer-events: none; /* 穿透點擊 */
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
