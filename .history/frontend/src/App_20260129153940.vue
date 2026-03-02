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
import { useRouter } from 'vue-router' // 引入 router 確保 JS 跳轉正常

const router = useRouter() // 雖然 template 裡用了 $router，但在 script 用 router 比較保險
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
  overflow-x: hidden; /* 防止捲軸閃爍 */
}

/* 3. 讓所有標題預設繼承圓體並加粗 */
h1, h2, h3, .brand-title {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
}

/* 讓按鈕等組件也強制換字體，並保持自定義滑鼠體驗 */
.v-btn, .v-card-title, .v-list-item-title {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  cursor: none !important; /* 確保滑鼠移上去還是顯示布丁 */
}
</style>

<style scoped>
/* --- 元件專用樣式區 --- */

.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none !important; /* 確保不擋住點擊 */
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  pointer-events: none !important; /* 確保不擋住點擊 */
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
