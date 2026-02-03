<template>
  <v-app>
    <v-navigation-drawer
      class="admin-drawer"
      color="white"
      permanent
      theme="light"
      width="280"
    >
      <!-- 用戶資訊卡片 -->
      <div class="user-info-card">
        <div class="user-avatar-wrapper">
          <v-avatar
            class="user-avatar"
            size="80"
          >
            <v-img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${user.account}`"></v-img>
          </v-avatar>
        </div>
        <h3 class="text-h6 font-weight-bold mt-3 text-white">{{ user.account }}</h3>
        <p class="text-caption text-white opacity-90">系統管理員</p>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- 導航選單 -->
      <v-list class="px-3" nav>
        <v-list-item
          v-for="nav in navs"
          :key="nav.to"
          class="nav-item mb-2"
          color="orange-darken-2"
          :prepend-icon="nav.icon"
          rounded="xl"
          :title="nav.title"
          :to="nav.to"
        ></v-list-item>
      </v-list>

      <!-- 底部裝飾 -->
      <template #append>
        <div class="pa-4 text-center">
          <v-chip
            color="orange-lighten-4"
            prepend-icon="mdi-shield-check"
            size="small"
          >
            管理模式
          </v-chip>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main style="background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCCBC 100%);">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const navs = [
  { title: '商品管理', to: '/admin/products', icon: 'mdi-food' },
  { title: '評論管理', to: '/admin/reviews', icon: 'mdi-comment-text-multiple' },
  { title: '回首頁', to: '/', icon: 'mdi-home' },
]
</script>

<style scoped>
/* 側邊欄樣式 */
.admin-drawer {
  border-right: 1px solid rgba(255, 152, 0, 0.1) !important;
}

/* 用戶資訊卡片 */
.user-info-card {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%);
  padding: 32px 24px;
  text-align: center;
  margin: -1px -1px 0 -1px;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.2);
}

.user-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 導航項目樣式 */
.nav-item {
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 152, 0, 0.08) !important;
  border-color: rgba(255, 152, 0, 0.2);
  transform: translateX(4px);
}

.nav-item.v-list-item--active {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.15), rgba(245, 124, 0, 0.15)) !important;
  border-color: rgba(255, 152, 0, 0.3);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);
}

.nav-item :deep(.v-list-item__prepend) {
  margin-right: 16px;
}

/* 主內容區背景 */
:deep(.v-main__wrap) {
  min-height: 100vh;
}
</style>
