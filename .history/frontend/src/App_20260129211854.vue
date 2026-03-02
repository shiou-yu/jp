<template>
  <v-app>
    <div ref="dotRef" class="cursor-dot"></div>
    <div ref="puddingRef" class="cursor-pudding">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <v-app-bar
      app
      color="white"
      elevation="0"
      style="border-bottom: 1px solid #ECEFF1; z-index: 1009 !important;"
    >
      <v-container class="d-flex align-center">
        <v-app-bar-title
          class="font-weight-bold text-blue-grey-darken-3"
          style="cursor: pointer"
          @click="router.push('/')"
        >
          日本超商美食搜查隊
          <small class="text-caption text-grey ml-2" style="font-size: 0.6em;">JAPAN CVS PICKS</small>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-for="nav in navs" :key="nav.to">
          <v-btn
            v-if="nav.show"
            class="text-blue-grey-darken-3 font-weight-bold"
            style="z-index: 1010;"
            :to="nav.to"
            variant="text"
          >
            <v-icon :icon="nav.icon" start></v-icon>
            {{ nav.title }}

            <v-badge
              v-if="nav.to === '/favorites' && (user.cart > 0 || (Array.isArray(user.cart) && user.cart.length > 0))"
              color="red-lighten-1"
              :content="Array.isArray(user.cart) ? user.cart.length : user.cart"
              floating
            ></v-badge>
          </v-btn>
        </template>

        <v-btn
          v-if="user.isLoggedIn"
          class="text-blue-grey-darken-3 font-weight-bold"
          prepend-icon="mdi-hand-wave-outline"
          style="z-index: 1010;"
          variant="text"
          @click="logout"
        >
          登出
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background-color: #FFF9F0; min-height: 100vh;">
      <router-view />
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// --- 動畫邏輯 (放在 App.vue 更穩定，因為這裡永遠不會被銷毀) ---
const dotRef = ref(null)
const puddingRef = ref(null)

let mouseX = 0
let mouseY = 0
let puddingX = 0
let puddingY = 0
let rotation = 0
let scale = 1
let animationFrameId = null

const updateMouse = (e) => {
  const deltaX = e.clientX - mouseX
  rotation = deltaX * 0.5
  mouseX = e.clientX
  mouseY = e.clientY

  if (dotRef.value) {
    dotRef.value.style.left = `${mouseX}px`
    dotRef.value.style.top = `${mouseY}px`
  }
}

const onMouseDown = () => { scale = 0.8 }
const onMouseUp = () => { scale = 1 }

const updateAnimation = () => {
  puddingX += (mouseX - puddingX) * 0.15
  puddingY += (mouseY - puddingY) * 0.15

  if (puddingRef.value) {
    puddingRef.value.style.transform = `translate(${puddingX}px, ${puddingY}px) rotate(${rotation}deg) scale(${scale})`
  }

  animationFrameId = requestAnimationFrame(updateAnimation)
}

onMounted(() => {
  // 檢查是否在客戶端執行 (避免 SSR 錯誤)
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', updateMouse)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    updateAnimation()
  }
})

// App.vue 其實不太會觸發 Unmounted，但寫著保險
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', updateMouse)
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }
})

// --- 選單邏輯 ---
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
/* 注意：App.vue 的 style 通常不加 scoped，或者是用全域 style */
/* 如果您發現樣式跑掉，把 scoped 拿掉試試看 */

.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none !important; /* 讓點擊穿透，非常重要 */
  z-index: 9998;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  pointer-events: none !important; /* 讓點擊穿透，非常重要 */
  z-index: 9999;
  margin-top: -22px;
  margin-left: -22px;
}

.cursor-pudding img {
  width: 100%;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}
</style>

