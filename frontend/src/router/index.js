/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router'  // 👈 改這裡
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),  // 👈 改這裡
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  // 移除異步 API 請求，直接使用已載入的用戶資料
  // 根據登入狀態和權限判斷能不能去目標頁面
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 去未登入限定頁面，且使用者有登入，回首頁
    next('/')
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 去登入限定頁面,且使用者沒有登入，回登入頁面
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 去管理員限定頁面，且使用者不是管理員，回首頁
    next('/')
  } else {
    // 繼續
    next()
  }
})

router.afterEach((to) => {
  // 如果 meta.title 有值，就顯示「日本超商精選・標題」
  // 如果沒有（例如首頁），就顯示預設的「日本超商精選 — 發現日常的小確幸」
  document.title = to.meta.title ? `日本超商精選・${to.meta.title}` : `日本超商精選 — 發現日常的小確幸`
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
