<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100" justify="center">
      <v-col class="text-center" cols="12">
        <v-icon class="mb-4" color="grey-darken-1" size="64">mdi-clipboard-text-outline</v-icon>

        <h1 class="text-h4 font-weight-bold" style="color: #37474F; letter-spacing: 0.1em;">
          請選擇管理項目
        </h1>

        <p class="text-grey mt-3">點擊側邊選單即可開始編輯商品與訂單資料</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: "後台管理"
  login: login-only
  admin: true
</route>
