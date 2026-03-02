// stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const cart = ref(0)
    const cartItems = ref([])
    const role = ref('user')
    const token = ref('')

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      account.value = data.account
      cart.value = data.cart
      cartItems.value = data.cartItems || []
      role.value = data.role

      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      account.value = ''
      cart.value = 0
      cartItems.value = []
      role.value = 'user'
      token.value = ''
    }

    // 獲取用戶資料
    const getUser = async () => {
      if (!token.value) return

      try {
        // 👇 動態導入避免循環依賴
        const { apiAuth } = await import('@/plugins/axios')
        const { data } = await apiAuth.get('/user/profile')

        account.value = data.result.account
        cart.value = data.result.cart
        cartItems.value = data.result.cartItems || []
        role.value = data.result.role
      } catch (error) {
        console.error('獲取用戶資料失敗:', error)
        if (error.response?.status === 401) {
          logout()
        }
      }
    }

    // 更新購物車商品列表
    const updateCartItems = async () => {
      if (!token.value) return

      try {
        // 👇 動態導入避免循環依賴
        const { apiAuth } = await import('@/plugins/axios')
        const { data } = await apiAuth.get('/user/cart')

        console.log('===== 購物車 API 回傳 =====')
        console.log('完整回應:', data)
        console.log('data.result:', data.result)
        console.log('data.result 型態:', typeof data.result)
        console.log('是陣列嗎?', Array.isArray(data.result))

        if (Array.isArray(data.result)) {
          cartItems.value = data.result
          cart.value = data.result.length
          console.log('✅ 購物車商品列表:', JSON.stringify(data.result, null, 2))
        } else {
          cart.value = data.result
          console.log('⚠️ 後端只回傳數量:', cart.value)
        }
      } catch (error) {
        console.error('更新購物車失敗:', error)
      }
    }

    return {
      account,
      cart,
      cartItems,
      role,
      token,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      getUser,
      updateCartItems,
    }
  },
  {
    persist: {
      key: 'shop-user',
      pick: ['token'],
    },
  },
)
