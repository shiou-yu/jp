<template>
  <v-app>
    <div class="cursor-dot" :style="dotStyle"></div>
    <div class="cursor-pudding" :style="puddingStyle">
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
          <small class="text-caption text-grey ml-2">JAPAN CVS PICKS</small>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-for="nav in navs" :key="nav.to">
          <v-btn
            v-if="nav.show"
            class="text-blue-grey-darken-3 font-weight-bold"
            :to="nav.to"
            variant="text"
            style="z-index: 1010;"
          >
            <v-icon :icon="nav.icon" start></v-icon>
            {{ nav.title }}

            <v-badge
              v-if="nav.to === '/cart' && (user.cart > 0 || (Array.isArray(user.cart) && user.cart.length > 0))"
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
          variant="text"
          @click="logout"
          style="z-index: 1010;"
        >
          登出
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background-color: #FFF9F0; min-height: 100vh;">
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// --- 滑鼠特效邏輯 ---
const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
const scale = ref(1)

const updateMouse = (e) => {
  const deltaX = e.clientX - mouse.value.x
  rotation.value = deltaX * 0.5
  mouse.value.x = e.clientX
  mouse.value.y = e.clientY
}

const onMouseDown = () => scale.value = 0.8
const onMouseUp = () => scale.value = 1

const updateAnimation = () => {
  puddingPos.value.x += (mouse.value.x - puddingPos.value.x) * 0.15
  puddingPos.value.y += (mouse.value.y - puddingPos.value.y) * 0.15
  requestAnimationFrame(updateAnimation)
}

const puddingStyle = computed(() => ({
  transform: `translate(${puddingPos.value.x}px, ${puddingPos.value.y}px) rotate(${rotation.value}deg) scale(${scale.value})`,
}))

const dotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
}))

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', updateMouse)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    updateAnimation()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', updateMouse)
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
  }
})

// --- 導覽列資料 ---
const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-compass-outline', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-pencil-outline', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-key-outline', show: !user.isLoggedIn },
  { title: '收藏清單', to: '/cart', icon: 'mdi-heart', show: user.isLoggedIn },
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

<style scoped>
/* 滑鼠特效樣式 */
.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none !important; /* 確保不擋住按鈕 */
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-out;
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  pointer-events: none !important; /* 確保不擋住按鈕 */
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
