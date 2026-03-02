import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 1. 建立一般的 API 實例 (不用登入也能用，例如看商品列表)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:4000',
})

// 2. 建立需要驗證的 API 實例 (需要登入才能用，例如加入購物車、留言)
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:4000',
})

// ★ 設定攔截器：每次發送 apiAuth 請求前，自動把使用者的 Token 帶入 Header
apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// ★ 設定攔截器：如果後端回傳 401 (未授權/Token過期)，就自動登出
apiAuth.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    if (error.response.data.message === 'JWT 格式錯誤' || error.response.status === 401) {
      const user = useUserStore()
      user.logout()
    }
    return Promise.reject(error)
  },
)
