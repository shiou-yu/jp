<template>
  <v-app>
    <div class="pudding-cursor" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <v-app-bar color="white" elevation="0" style="border-bottom: 1px solid #ECEFF1;">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3" style="letter-spacing: 2px;">
          日本超商美食搜查隊 <small style="font-size: 0.5em; opacity: 0.6; letter-spacing: 1px;">JAPAN CVS PICKS</small>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-for="nav in navs" :key="nav.to">
          <v-btn
            v-if="nav.show"
            class="text-blue-grey-darken-3 font-weight-bold"
            :to="nav.to"
            variant="text"
          >
            <v-icon :icon="nav.icon" start></v-icon>
            {{ nav.title }}

            <v-badge
              v-if="nav.to === '/cart' && user.cart > 0"
              color="red-lighten-1"
              :content="user.cart"
              floating
            ></v-badge>
          </v-btn>
        </template>

        <v-btn
          v-if="user.isLoggedIn"
          class="text-blue-grey-darken-3 font-weight-bold"
          prepend-icon="mdi-hand-wave-outline"
          variant="text"
          @click="logout"
        >
          登出
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background-color: #FFF9F0;">
      <router-view :key="$route.fullPath" />
    </v-main>

    <v-footer class="py-6" color="white" style="border-top: 1px solid #ECEFF1;">
      <v-container class="d-flex justify-center text-blue-grey-darken-3 font-weight-bold ga-6">
        <v-btn color="blue-grey-darken-3" to="/" variant="text">熱門商品</v-btn>
        <v-btn color="blue-grey-darken-3" variant="text">最新消息</v-btn>
        <v-btn color="blue-grey-darken-3" variant="text">關於我們</v-btn>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
// ⚠️ 關鍵修正：確保所有需要的工具都匯入了
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// --- 🍮 游標平滑動效邏輯 ---
const mousePos = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)

const updateMouse = (e) => {
  const deltaX = e.clientX - mousePos.value.x
  rotation.value = deltaX * 0.4 // 根據移動速度計算傾斜角度
  mousePos.value.x = e.clientX
  mousePos.value.y = e.clientY
}

const animate = () => {
  // Lerp 平滑演算法：減少殘影的關鍵
  puddingPos.value.x += (mousePos.value.x - puddingPos.value.x) * 0.2
  puddingPos.value.y += (mousePos.value.y - puddingPos.value.y) * 0.2
  requestAnimationFrame(animate)
}

const puddingStyle = computed(() => ({
  transform: `translate3d(${puddingPos.value.x}px, ${puddingPos.value.y}px, 0) rotate(${rotation.value}deg)`,
}))

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})

// --- 導覽列設定 ---
const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-compass-outline', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-pencil-outline', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-key-outline', show: !user.isLoggedIn },
  { title: '收藏清單', to: '/favorites', icon: 'mdi-heart', show: user.isLoggedIn },
  { title: '管理', to: '/admin', icon: 'mdi-clipboard-text-outline', show: user.isLoggedIn && user.isAdmin },
])

const logout = async () => {
  try {
    await serviceUser.logout()
  } catch (error) {
    console.log(error)
  }
  user.logout()
  router.push('/')
  createSnackbar({
    text: '登出成功',
    snackbarProps: { color: 'blue-grey-darken-3' },
  })
}
</script>

<style>
/* 🎨 全域樣式：隱藏原生滑鼠是避免殘影的最重要步驟 */
html, body, #app, .v-application {
  cursor: none !important;
}
/* 確保所有按鈕也隱藏原生滑鼠 */
a, button, .v-btn, i, .v-list-item {
  cursor: none !important;
}
</style>

<style scoped>
.pudding-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  pointer-events: none; /* 確保不擋住點擊事件 */
  z-index: 99999;
  transition: none; /* 禁止 CSS transition 以消除拖尾殘影 */
  margin-top: -20px;
  margin-left: -20px;
  will-change: transform;
}

.pudding-cursor img {
  width: 100%;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
</style>
嘗試修bug 
