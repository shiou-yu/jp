<script setup>
  import { ref } from 'vue'

  const drawer = ref(true)

  const categories = [
    '日本限定零食', '泡麵/即食食品', '飲料/酒類', '季節限定', '美妝護理'
  ]
</script>

<template>
  <v-app>
    <v-app-bar flat border color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold text-h5" style="cursor: pointer">
        <span class="text-red">日本便利商店</span>精選網
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
        <v-tooltip activator="parent" location="bottom">搜尋商品</v-tooltip>
      </v-btn>

      <v-btn icon>
        <v-badge content="5" color="red" size="x-small">
          <v-icon>mdi-heart-outline</v-icon>
        </v-badge>
        <v-tooltip activator="parent" location="bottom">我的收藏</v-tooltip>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-account-circle-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">會員登入</v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="250" floating>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="首頁" value="home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-information" title="關於我們" value="about" to="/about"></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-subheader class="font-weight-bold text-black">商品列表</v-list-subheader>

        <v-list-item
          v-for="(category, i) in categories"
          :key="i" :value="category" active-color="primary" link
        >
          <v-list-item-title>{{ category }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-item prepend-icon="mdi-fire" title="活動專區" value="events"></v-list-item>
        <v-list-item prepend-icon="mdi-post" title="部落格文章" value="blog"></v-list-item>
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
