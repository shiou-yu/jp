<template>
  <v-app>
    <v-app-bar color="white" elevation="0" style="border-bottom: 1px solid #ECEFF1; z-index: 1000;">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3" style="letter-spacing: 2px;">
          日本超商挖到寶 <small style="font-size: 0.5em; opacity: 0.6; letter-spacing: 1px;">JAPAN CVS PICKS</small>
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

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
/* 🎨 全域樣式 */
html, body, #app, .v-application {
  cursor: none !important;
}
a, button, .v-btn, i, .v-list-item {
  cursor: none !important;
}
</style>
