// stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiAuth } from '@/plugins/axios' // 👈 直接導入

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const cart = ref(0)
    const cartItems = ref([]) // 👈 購物車商品列表
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
      if (!token.value) {
        return
      }

      try {
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

    // 👇 新增：更新購物車商品列表
    const updateCartItems = async () => {
      if (!token.value) {
        return
      }

      try {
        const { data } = await apiAuth.get('/user/cart')

        console.log('===== 購物車 API 回傳 =====')
        console.log('完整回應:', data)
        console.log('data.result:', data.result)
        console.log('data.result 型態:', typeof data.result)
        console.log('是陣列嗎?', Array.isArray(data.result))

        // 如果回傳的是陣列
        if (Array.isArray(data.result)) {
          cartItems.value = data.result
          cart.value = data.result.length
          console.log('✅ 設定 cartItems:', cartItems.value)
          console.log('✅ 設定 cart 數量:', cart.value)
        } else {
          // 如果只是數字
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
      cartItems, // 👈 記得匯出
      role,
      token,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      getUser,
      updateCartItems, // 👈 記得匯出
    }
  },
  {
    persist: {
      key: 'shop-user',
      pick: ['token'],
    },
  },
)
