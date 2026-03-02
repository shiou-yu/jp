<script setup>
  // 側邊欄分類資料 (因為是全站共用，放這裡)
  const categories = [
    '日本限定零食', '泡麵/即食食品', '飲料/酒類', '季節限定', '美妝護理'
  ]
</script>

<template>
  <v-app>
    <v-app-bar flat border color="white">
      <v-app-bar-title class="font-weight-bold text-h5">
        <span class="text-red">日本便利商店</span>精選網
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-cart-outline"></v-btn>
      <v-btn icon="mdi-account-circle-outline"></v-btn>
    </v-app-bar>

    <v-navigation-drawer width="250" floating permanent>
      <v-list density="compact" nav>
        <v-list-item title="首頁" value="home" to="/"></v-list-item>
        <v-list-item title="關於我們" value="about" to="/about"></v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-subheader class="font-weight-bold text-black">商品列表</v-list-subheader>

        <v-list-item
          v-for="(category, i) in categories"
          :key="i"
          :value="category"
          active-color="primary"
          link
        >
          <v-list-item-title>{{ category }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>
        <v-list-item title="活動專區" value="events"></v-list-item>
        <v-list-item title="部落格文章" value="blog"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #FFFBE6;">
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
