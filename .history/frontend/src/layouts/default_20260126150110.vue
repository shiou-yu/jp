<template>
    <v-app>
        <v-app-bar color="white" elevation="0" style="border-bottom: 1px solid #ECEFF1;">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3" style="letter-spacing: 2px;">
          日本超商商品評論網
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

prepend-icon="mdi-logout"

variant="text"

@click="logout"
>
          登出
        </v-btn>
      </v-container>
    </v-app-bar>

        <v-main style="background-color: #FFF9F0;">
            <v-container class="py-8">
                <router-view :key="$route.fullPath" />
            </v-container>
        </v-main>

        <v-footer class="py-6" color="white" style="border-top: 1px solid #ECEFF1;">
            <v-container class="d-flex justify-center text-blue-grey-darken-3 font-weight-bold ga-6">
                <v-btn color="blue-grey-darken-3" to="/" variant="text">熱門商品</v-btn>
                <v-btn color="blue-grey-darken-3" variant="text">最新消息</v-btn>
                <v-btn color="blue-grey-darken-3" variant="text">優惠情報</v-btn>
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

const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-home', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-account-plus', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-login', show: !user.isLoggedIn },
  { title: '收藏清單', to: '/favorites', icon: 'mdi-heart', show: user.isLoggedIn },
  { title: '管理', to: '/admin', icon: 'mdi-cog', show: user.isLoggedIn && user.isAdmin },
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
    snackbarProps: {
      color: 'blue-grey-darken-3', // 提示框同步改為藍灰色
    },
  })
}
</script>

<style scoped>
/* 全域字體微調，讓無印風更明顯 */
.v-application {
  font-family: 'Noto Sans TC', sans-serif;
  background-color: #FFF9F0 !important;
}
</style>
