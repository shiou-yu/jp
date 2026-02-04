<template>
  <div id="app">
    <div v-if="isMounted" class="cursor-dot" :style="dotStyle"></div>

    <div v-if="isMounted" class="cursor-pudding" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <v-app>
      <v-app-bar
        :class="['app-bar-custom', { 'scrolled': scrolled }]"
        fixed
        flat
        height="80"
      >
        <v-container class="d-flex align-center px-0">
          <v-app-bar-title
            class="font-weight-bold transition-all logo-title"
            :class="scrolled ? 'text-grey-darken-4' : 'text-white'"
          >
            JAPAN CVS PICKS
          </v-app-bar-title>

          <v-spacer></v-spacer>

          <!-- 桌面版選單 -->
          <div class="d-none d-md-flex align-center">
            <template v-for="nav in navs" :key="nav.to">
              <v-btn
                v-if="nav.show"
                class="font-weight-bold transition-all nav-btn mx-1"
                :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
                flat
                :ripple="false"
                style="font-size: 1.1rem; letter-spacing: 1px;"
                :to="nav.to"
                variant="text"
              >
                {{ nav.title }}

                <v-badge
                  v-if="(nav.to === '/favorites') && user.cart > 0"
                  color="red-lighten-1"
                  :content="user.cart"
                  floating
                ></v-badge>
              </v-btn>
            </template>

            <v-btn
              v-if="user.isLoggedIn"
              class="font-weight-bold transition-all nav-btn mx-1"
              :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
              flat
              :ripple="false"
              style="font-size: 1.1rem; letter-spacing: 1px;"
              variant="text"
              @click="logout"
            >
              LOGOUT
            </v-btn>
          </div>

          <!-- 手機版漢堡選單按鈕 -->
          <v-btn
            class="d-md-none nav-btn"
            :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
            flat
            icon
            :ripple="false"
            variant="text"
            @click="drawer = !drawer"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-container>
      </v-app-bar>

      <!-- 側邊抽屜選單 -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        temporary
        width="280"
      >
        <v-list class="pt-4">
          <v-list-item
            class="text-h6 font-weight-bold mb-2"
            title="✕ CLOSE"
            @click="drawer = false"
          ></v-list-item>

          <v-divider class="my-2"></v-divider>

          <template v-for="nav in navs" :key="nav.to">
            <v-list-item
              v-if="nav.show"
              class="text-h6 font-weight-medium my-1"
              :title="nav.title"
              :to="nav.to"
              @click="drawer = false"
            >
              <template v-if="nav.to === '/favorites' && user.cart > 0" #append>
                <v-badge
                  color="red-lighten-1"
                  :content="user.cart"
                  inline
                ></v-badge>
              </template>
            </v-list-item>
          </template>

          <v-list-item
            v-if="user.isLoggedIn"
            class="text-h6 font-weight-medium my-1"
            title="LOGOUT"
            @click="logout"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="padding-top: 0 !important; background-color: #FFF9F0;">
        <router-view></router-view>
      </v-main>

      <!-- 🍱 超商食品動畫頁尾 -->
      <v-footer class="py-8" color="white" style="border-top: 1px solid #ECEFF1;">
        <v-container>
          <!-- 可愛的超商食品動畫 -->
          <div class="food-animation-container">
            <div class="food-items">
              <!-- 飯糰 -->
              <div class="food-item" style="animation-delay: 0s;">
                <span class="food-emoji">🍙</span>
              </div>
              <!-- 便當 -->
              <div class="food-item" style="animation-delay: 0.2s;">
                <span class="food-emoji">🍱</span>
              </div>
              <!-- 三明治 -->
              <div class="food-item" style="animation-delay: 0.4s;">
                <span class="food-emoji">🥪</span>
              </div>
              <!-- 泡麵 -->
              <div class="food-item" style="animation-delay: 0.6s;">
                <span class="food-emoji">🍜</span>
              </div>
              <!-- 關東煮 -->
              <div class="food-item" style="animation-delay: 0.8s;">
                <span class="food-emoji">🍢</span>
              </div>
              <!-- 冰淇淋 -->
              <div class="food-item" style="animation-delay: 1s;">
                <span class="food-emoji">🍦</span>
              </div>
              <!-- 甜甜圈 -->
              <div class="food-item" style="animation-delay: 1.2s;">
                <span class="food-emoji">🍩</span>
              </div>
              <!-- 飲料 -->
              <div class="food-item" style="animation-delay: 1.4s;">
                <span class="food-emoji">🧋</span>
              </div>
              <!-- 零食 -->
              <div class="food-item" style="animation-delay: 1.6s;">
                <span class="food-emoji">🍿</span>
              </div>
              <!-- 麵包 -->
              <div class="food-item" style="animation-delay: 1.8s;">
                <span class="food-emoji">🥐</span>
              </div>
            </div>
            <p class="text-center mt-6 text-grey-darken-1 font-weight-medium">
              © 2026 JAPAN CVS PICKS - 探索日本超商美食
            </p>
          </div>
        </v-container>
      </v-footer>
    </v-app>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// 布丁滑鼠游標
const isMounted = ref(false)
const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
const scale = ref(1)
let animationFrameId = null
let isAnimating = false

const handleMouseMove = (e) => {
  if (!isAnimating) return
  const deltaX = e.clientX - mouse.value.x
  rotation.value = deltaX * 0.5
  mouse.value.x = e.clientX
  mouse.value.y = e.clientY
}

const handleMouseDown = () => {
  if (isAnimating) scale.value = 0.8
}

const handleMouseUp = () => {
  if (isAnimating) scale.value = 1
}

const update = () => {
  if (!isAnimating) return
  puddingPos.value.x += (mouse.value.x - puddingPos.value.x) * 0.15
  puddingPos.value.y += (mouse.value.y - puddingPos.value.y) * 0.15
  animationFrameId = requestAnimationFrame(update)
}

const puddingStyle = computed(() => ({
  transform: `translate(${puddingPos.value.x}px, ${puddingPos.value.y}px)
              rotate(${rotation.value}deg)
              scale(${scale.value})`,
  transition: 'transform 0.1s ease-out',
}))

const dotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
  transition: 'all 0.3s ease-out',
}))

// 抽屜選單狀態
const drawer = ref(false)

// 滾動狀態
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// --- 導覽列設定 ---
const navs = computed(() => [
  { title: 'HOME', to: '/', show: true },
  { title: 'REGISTER', to: '/register', show: !user.isLoggedIn },
  { title: 'LOGIN', to: '/login', show: !user.isLoggedIn },
  { title: 'FAVORITES', to: '/favorites', show: user.isLoggedIn },
  { title: 'ADMIN', to: '/admin', show: user.isLoggedIn && user.isAdmin },
])

const logout = async () => {
  try {
    await serviceUser.logout()
  } catch (error) {
    console.log(error)
  }
  user.logout()
  drawer.value = false
  router.push('/')
  createSnackbar({
    text: '登出成功',
    snackbarProps: { color: 'blue-grey-darken-3' },
  })
}

onMounted(async () => {
  // 布丁滑鼠
  isAnimating = true
  isMounted.value = true
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mousedown', handleMouseDown, { passive: true })
  window.addEventListener('mouseup', handleMouseUp, { passive: true })
  update()

  // 滾動監聽
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 如果已登入，獲取用戶資料
  if (user.isLoggedIn) {
    await user.getUser()
  }
})

onBeforeUnmount(() => {
  isAnimating = false
  isMounted.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('scroll', handleScroll)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})
</script>

<style>
/* 🎨 全域樣式 */
html, body, #app, .v-application {
  cursor: none !important;
}
a, button, .v-btn, i, .v-list-item {
  cursor: none !important;
}

/* 平滑過渡 */
.transition-all {
  transition: all 0.3s ease !important;
}

/* 布丁滑鼠游標 */
.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  pointer-events: none;
  z-index: 9999;
  margin-top: -20px;
  margin-left: -20px;
}

.cursor-pudding img {
  width: 100%;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

/* ✨ 導覽列霧透效果 */
.app-bar-custom {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 滾動後的霧透玻璃效果 */
.app-bar-custom.scrolled {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(15px) saturate(180%);
  -webkit-backdrop-filter: blur(15px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Logo 標題 - 漸層金色 */
.logo-title {
  font-size: 1.8rem !important;
  letter-spacing: 4px;
  font-weight: 700 !important;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 10px rgba(255, 215, 0, 0.3));
}

/* 滾動後改回深色 */
.logo-title.text-grey-darken-4 {
  background: linear-gradient(135deg, #DAA520 0%, #B8860B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: none;
}

/* 導覽列按鈕文字陰影 */
.nav-btn:not(.scrolled) {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

/* 移除按鈕的背景、hover、active 效果 */
.nav-btn {
  background: none !important;
  position: relative;
}

.nav-btn .v-btn__overlay {
  display: none !important;
}

.nav-btn .v-btn__content {
  position: relative;
}

.nav-btn:hover,
.nav-btn:focus,
.nav-btn:active {
  background: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

/* 底線動畫 - 從左到右滑入 */
.nav-btn .v-btn__content::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 3px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

/* hover 時底線從左滑出 */
.nav-btn:hover .v-btn__content::after {
  width: 100%;
}

/* active/當前頁面時底線保持 */
.nav-btn.v-btn--active .v-btn__content::after,
.router-link-active.nav-btn .v-btn__content::after,
.router-link-exact-active.nav-btn .v-btn__content::after {
  width: 100%;
}

/* 移除 Vuetify 預設樣式 */
.v-app-bar::before,
.v-app-bar::after {
  display: none !important;
}

.v-toolbar {
  border: none !important;
  box-shadow: none !important;
}

.v-toolbar__content {
  border: none !important;
}

.v-app-bar--border {
  border: none !important;
}

/* 🍱 超商食品動畫 */
.food-animation-container {
  text-align: center;
  padding: 20px 0;
}

.food-items {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.food-item {
  animation: bounce 2s ease-in-out infinite;
}

.food-emoji {
  font-size: 48px;
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.food-item:hover .food-emoji {
  transform: scale(1.3) rotate(10deg);
  cursor: none;
}

/* 跳躍動畫 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 響應式調整 */
@media (max-width: 600px) {
  .food-emoji {
    font-size: 36px;
  }

  .food-items {
    gap: 12px;
  }
}
</style>
