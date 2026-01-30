<template>
  <v-app>
    <v-navigation-drawer color="grey-lighten-5" permanent theme="light">
      <v-list>
        <v-list-item
          :prepend-avatar="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`"
          :title="user.account"
        />
      </v-list>

      <v-divider class="mb-2"></v-divider>

      <v-list nav>
        <v-list-item
          v-for="nav in navs"
          :key="nav.to"
          color="primary"
          :prepend-icon="nav.icon"
          rounded="xl"
          :title="nav.title"
          :to="nav.to"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const navs = [
  { title: '商品管理', to: '/admin/products', icon: 'mdi-cart' },
  { title: '訂單管理', to: '/admin/orders', icon: 'mdi-invoice-list' },
  { title: '回首頁', to: '/', icon: 'mdi-home' },
]
</script>
