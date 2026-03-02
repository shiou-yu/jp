<template>
  <v-app>
    <v-app-bar color="white" elevation="0" border="b">
      <v-container class="d-flex align-center">
        <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3">
          日本超商商品評論網
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-for="nav in navs" :key="nav.to">
          <v-btn v-if="nav.show" :to="nav.to" variant="text" class="font-weight-bold text-blue-grey-darken-3">
            <v-icon :icon="nav.icon" start></v-icon>{{ nav.title }}
          </v-btn>
        </template>
        <v-btn v-if="user.isLoggedIn" variant="text" @click="logout" prepend-icon="mdi-logout">登出</v-btn>
      </v-container>
    </v-app-bar>

    <v-main style="background-color: #FFF9F0;">
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import serviceUser from '@/services/user'

const user = useUserStore()
const router = useRouter()

const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-home', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-account-plus', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-login', show: !user.isLoggedIn },
  { title: '收藏', to: '/favorites', icon: 'mdi-heart', show: user.isLoggedIn },
])

const logout = async () => {
  await serviceUser.logout()
  user.logout()
  router.push('/')
}
</script>
