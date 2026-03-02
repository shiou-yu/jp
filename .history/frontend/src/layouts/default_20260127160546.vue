<template>
  <v-app>
    <div class="pudding-cursor" :style="puddingStyle">
      <img src="/頁籤 (1).png" alt="pudding" />
    </div>

    <v-app-bar color="white" elevation="0" style="border-bottom: 1px solid #ECEFF1;">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3" style="letter-spacing: 2px;">
          日本超商精選 <small style="font-size: 0.5em; opacity: 0.6; letter-spacing: 1px;">JAPAN CVS PICKS</small>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <template v-for="nav in navs" :key="nav.to">
          <v-btn
            v-if="nav.show"
            class="text-blue-grey-darken-3 font-weight-bold nav-btn"
            :to="nav.to"
            variant="text"
          >
            <v-icon :icon="nav.icon" start></v-icon>
            {{ nav.title }}
            <v-badge v-if="nav.to === '/cart' && user.cart > 0" color="red-lighten-1" :content="user.cart" floating></v-badge>
          </v-btn>
        </template>

        <v-btn
          v-if="user.isLoggedIn"
          class="text-blue-grey-darken-3 font-weight-bold nav-btn"
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

    </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// --- 游標邏輯 ---
const mousePos = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)

const updateMouse = (e) => {
  // 計算旋轉角度減少殘影感
  const deltaX = e.clientX - mousePos.value.x
  rotation.value = deltaX * 0.4

  mousePos.value.x = e.clientX
  mousePos.value.y = e.clientY
}

const animate = () => {
  // 使用較高的 Lerp 係數 (0.2) 減少延遲感
  puddingPos.value.x += (mousePos.value.x - puddingPos.value.x) * 0.2
  puddingPos.value.y += (mousePos.value.y - puddingPos.value.y) * 0.2
  requestAnimationFrame(animate)
}

const puddingStyle = computed(() => ({
  // 使用 transform 代替 top/left，並加上 translate3d 強制硬體加速，徹底消除殘影
  transform: `translate3d(${puddingPos.value.x}px, ${puddingPos.value.y}px, 0) rotate(${rotation.value}deg)`,
}))

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
})

const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-compass-outline', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-pencil-outline', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-key-outline', show: !user.isLoggedIn },
  { title: '收藏清單', to: '/favorites', icon: 'mdi-heart', show: user.isLoggedIn },
  { title: '管理', to: '/admin', icon: 'mdi-clipboard-text-outline', show: user.isLoggedIn && user.isAdmin },
])

const logout = async () => { /* 原本的 logout 邏輯 */ }
</script>

<style>
/* 關鍵：強制全域隱藏原生滑鼠，防止殘影閃爍 */
html, body, #app, .v-application {
  cursor: none !important;
}

/* 確保按鈕、圖示等所有互動元素也不顯示原生游標 */
a, button, .v-btn, .v-list-item, i {
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
  pointer-events: none;
  z-index: 99999;
  /* 關鍵：transition 設定為 none，避免與 JS 計算位移衝突產生殘影 */
  transition: none;
  margin-top: -20px;
  margin-left: -20px;
  will-change: transform;
}

.pudding-cursor img {
  width: 100%;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
</style>

