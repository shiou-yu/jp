<template>
  <v-app>
    <v-app-bar
      :color="scrolled ? 'white' : 'transparent'"
      :elevation="scrolled ? 2 : 0"
      flat
      fixed
      height="80"
      :style="appBarStyle"
    >
      <v-container class="d-flex align-center px-0">
        <v-app-bar-title
          :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
          class="font-weight-bold transition-all"
          style="letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-size: 1.5rem;"
        >
          JAPAN CVS PICKS
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <!-- 桌面版選單 -->
        <div class="d-none d-md-flex align-center">
          <template v-for="nav in navs" :key="nav.to">
            <v-btn
              v-if="nav.show"
              :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
              :to="nav.to"
              class="font-weight-bold transition-all nav-btn mx-1"
              variant="text"
              :ripple="false"
              flat
              style="font-size: 1.1rem; letter-spacing: 1px;"
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
            :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
            class="font-weight-bold transition-all nav-btn mx-1"
            variant="text"
            :ripple="false"
            flat
            style="font-size: 1.1rem; letter-spacing: 1px;"
            @click="logout"
          >
            LOGOUT
          </v-btn>
        </div>

        <!-- 手機版漢堡選單按鈕 -->
        <v-btn
          class="d-md-none nav-btn"
          :class="scrolled ? 'text-blue-grey-darken-3' : 'text-white'"
          icon
          variant="text"
          :ripple="false"
          flat
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
          title="✕ CLOSE"
          class="text-h6 font-weight-bold mb-2"
          @click="drawer = false"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <template v-for="nav in navs" :key="nav.to">
          <v-list-item
            v-if="nav.show"
            :title="nav.title"
            :to="nav.to"
            class="text-h6 font-weight-medium my-1"
            @click="drawer = false"
          >
            <template #append v-if="nav.to === '/favorites' && user.cart > 0">
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
          title="LOGOUT"
          class="text-h6 font-weight-medium my-1"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="padding-top: 0 !important; background-color: #FFF9F0;">
      <router-view></router-view>
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
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// 抽屜選單狀態
const drawer = ref(false)

// 滾動狀態
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 導覽列樣式
const appBarStyle = computed(() => ({
  transition: 'all 0.3s ease',
  border: 'none !important',
}))

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
  drawer.value = false // 關閉抽屜
  router.push('/')
  createSnackbar({
    text: '登出成功',
    snackbarProps: { color: 'blue-grey-darken-3' },
  })
}
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

/* 導覽列按鈕文字陰影 */
.nav-btn:not(.scrolled) {
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

/* 移除按鈕的背景、hover、active 效果 */
.nav-btn {
  background: none !important;
}

.nav-btn::before,
.nav-btn::after {
  display: none !important;
}

.nav-btn:hover,
.nav-btn:focus,
.nav-btn:active {
  background: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.nav-btn .v-btn__overlay {
  display: none !important;
}

/* 完全移除 v-app-bar 的背景和邊框 */
.v-app-bar {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.v-app-bar::before,
.v-app-bar::after {
  display: none !important;
}

/* 當沒有滾動時，完全透明 */
.v-app-bar.v-app-bar--transparent {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 移除 toolbar 的邊框和線條 */
.v-toolbar {
  border: none !important;
  box-shadow: none !important;
}

.v-toolbar__content {
  border: none !important;
}

/* 移除所有可能的邊框線 */
.v-app-bar--border {
  border: none !important;
}
</style>
