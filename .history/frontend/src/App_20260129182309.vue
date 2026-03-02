<template>
  <router-view />
</template>

<script setup>
// App.vue 保持乾淨，讓 layouts/default.vue 負責所有邏輯
</script>

<style>
/* 1. 隱藏系統原生滑鼠 (全域生效) */
html, body {
  cursor: none !important;
}

/* 2. 確保所有可點擊元素也不顯示原生滑鼠 */
a, button, .v-btn, .v-list-item, input {
  cursor: none !important;
}
</style>
