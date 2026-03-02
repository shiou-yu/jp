<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/user'
  import { useRouter } from 'vue-router'

  const drawer = ref(true)
  const router = useRouter()

  // 1. 初始化 Pinia Store
  const userStore = useUserStore()

  // 2. 解構狀態 (保持響應式)
  // 注意：這裡對應你 store 中的名稱：isLoggedIn, account, cart, isAdmin
  const { isLoggedIn, account, cart, isAdmin } = storeToRefs(userStore)

  // 3. 取得 action (不需要 storeToRefs)
  const { logout } = userStore

  // 登出功能
  const handleLogout = () => {
    logout()
    alert('已成功登出')
    router.push('/') // 登出後強制回首頁
  }

  const categories = [
    '日本限定零食', '泡麵/即食食品', '飲料/酒類', '季節限定', '美妝護理'
  ]
</script>

<template>
  <v-app>
    <v-app-bar flat border color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold text-h5" style="cursor: pointer">
        <router-link to="/" class="text-decoration-none text-black">
          <span class="text-red">日本便利商店</span>精選網
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon to="/search">
        <v-icon>mdi-magnify</v-icon>
        <v-tooltip activator="parent" location="bottom">搜尋商品</v-tooltip>
      </v-btn>

      <v-btn icon to="/cart">
        <v-badge :content="cart" color="green" size="x-small" v-if="cart > 0">
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
        <v-icon v-else>mdi-cart-outline</v-icon>

        <v-tooltip activator="parent" location="bottom">購物車</v-tooltip>
      </v-btn>

      <v-btn icon to="/favorites">
        <v-badge content="5" color="red" size="x-small">
          <v-icon>mdi-heart-outline</v-icon>
        </v-badge>
        <v-tooltip activator="parent" location="bottom">我的收藏</v-tooltip>
      </v-btn>

      <template v-if="!isLoggedIn">
        <v-btn icon to="/login">
          <v-icon>mdi-account-circle-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">會員登入</v-tooltip>
        </v-btn>
      </template>

      <template v-else>
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-2">
              <v-avatar color="red-lighten-1" size="32">
                <span class="text-white font-weight-bold text-caption">
                  {{ account?.substring(0, 1)?.toUpperCase() || 'U' }}
                </span>
              </v-avatar>
            </v-btn>
          </template>

          <v-list density="compact" width="200">
            <v-list-item>
              <v-list-item-title class="font-weight-bold text-red">
                {{ account || '使用者' }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ isAdmin ? '管理員' : '一般會員' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item v-if="isAdmin" to="/admin" prepend-icon="mdi-cog">
              <v-list-item-title>後台管理</v-list-item-title>
            </v-list-item>

            <v-list-item link @click="handleLogout" prepend-icon="mdi-logout" color="red">
              <v-list-item-title>登出</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="250" floating>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="首頁" value="home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="關於我們" value="about" to="/about"></v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-subheader class="font-weight-bold text-black">商品列表</v-list-subheader>

        <v-list-item
          v-for="(category, i) in categories"
          :key="i"
          :value="category"
          active-color="primary"
          :to="`/product?category=${category}`"
        >
          <v-list-item-title>{{ category }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-item prepend-icon="mdi-fire" title="活動專區" value="events" to="/events"></v-list-item>
        <v-list-item prepend-icon="mdi-post" title="部落格文章" value="blog" to="/blog"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #FFFBE6; min-height: 100vh;">
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-list-item--nav .v-list-item-title {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
