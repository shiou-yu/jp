// stores/user.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const account = ref('')
    const cart = ref(0) // 購物車商品數量
    const cartItems = ref([]) // 👈 新增：購物車商品列表
    const role = ref('user')
    const token = ref('')

    const isLoggedIn = computed(() => token.value.length > 0)
    const isAdmin = computed(() => role.value === 'admin')

    const login = (data) => {
      account.value = data.account
      cart.value = data.cart
      cartItems.value = data.cartItems || [] // 👈 新增
      role.value = data.role

      if (data.token) {
        token.value = data.token
      }
    }

    const logout = () => {
      account.value = ''
      cart.value = 0
      cartItems.value = [] // 👈 新增
      role.value = 'user'
      token.value = ''
    }

    // 獲取用戶資料
    const getUser = async () => {
      if (!token.value) {
        return
      }

      try {
        const axiosModule = await import('@/plugins/axios')
        const { apiAuth } = axiosModule.useApi()
        const { data } = await apiAuth.get('/user/profile')
        account.value = data.result.account
        cart.value = data.result.cart
        cartItems.value = data.result.cartItems || [] // 👈 新增：獲取購物車商品列表
        role.value = data.result.role
      } catch (error) {
        console.error('獲取用戶資料失敗:', error)
        if (error.response?.status === 401) {
          logout()
        }
      }
    }

    // 👇 新增：更新購物車商品列表的方法
    const updateCartItems = async () => {
      if (!token.value) {
        return
      }

      try {
        const axiosModule = await import('@/plugins/axios')
        const { apiAuth } = axiosModule.useApi()
        const { data } = await apiAuth.get('/user/cart')
        cartItems.value = data.result
        cart.value = data.result.length
      } catch (error) {
        console.error('更新購物車失敗:', error)
      }
    }

    return {
      account,
      cart,
      cartItems, // 👈 新增
      role,
      token,
      isLoggedIn,
      isAdmin,
      login,
      logout,
      getUser,
      updateCartItems, // 👈 新增
    }
  },
  {
    persist: {
      key: 'shop-user',
      pick: ['token'],
    },
  },
)
