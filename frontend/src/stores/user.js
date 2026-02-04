import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const cart = ref(0)
    const role = ref('user')
    const token = ref('')
    const avatarSeed = ref(1) // 👈 加這行

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      account.value = data.account
      cart.value = data.cart
      role.value = data.role
      avatarSeed.value = data.avatarSeed || 1 // 👈 加這行

      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      account.value = ''
      cart.value = 0
      role.value = 'user'
      token.value = ''
      avatarSeed.value = 1 // 👈 加這行
    }

    // 新增：獲取用戶資料（用於頁面刷新後）
    const getUser = async () => {
      if (!token.value) {
        return
      }

      try {
        // 動態導入並使用 apiAuth
        const axiosModule = await import('@/plugins/axios')
        const { apiAuth } = axiosModule.useApi()
        const { data } = await apiAuth.get('/user/profile')
        account.value = data.result.account
        cart.value = data.result.cart
        role.value = data.result.role
        avatarSeed.value = data.result.avatarSeed || 1 // 👈 加這行
      } catch (error) {
        console.error('獲取用戶資料失敗:', error)
        // 如果 token 無效，清空登入狀態
        if (error.response?.status === 401) {
          logout()
        }
      }
    }

    return {
      account,
      cart,
      role,
      token,
      avatarSeed, // 👈 加這行
      isLoggedIn,
      isAdmin,
      login,
      logout,
      getUser,
    }
  },
  {
    persist: {
      key: 'shop-user',
      pick: ['token'],
    },
  },
)
