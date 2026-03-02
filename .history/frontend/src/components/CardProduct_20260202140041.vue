<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const user = useUserStore()
const router = useRouter()

const props = defineProps({
  _id: { type: String, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: '' },
  price: { type: Number, required: true },
  priceJP: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
})

const imageUrl = computed(() => {
  if (!props.image) return 'https://via.placeholder.com/200?text=No+Image'
  if (props.image.startsWith('http')) return props.image
  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${props.image}`
})

const formatedPrice = computed(() => {
  return props.priceJP || `￥${props.price}`
})

// 檢查是否已在收藏清單中
const isFavorite = computed(() => {
  if (!user.isLoggedIn || !user.cartItems) return false

  return user.cartItems.some(item => {
    // 根據後端回傳的資料結構調整
    const productId = item.product?._id || item.product || item._id
    return productId === props._id
  })
})

const goToProduct = () => {
  router.push('/product/' + props._id)
}

const addFavorite = async () => {
  // 如果已收藏，不執行
  if (isFavorite.value) {
    createSnackbar({
      text: '此商品已在收藏清單中 ❤️',
      snackbarProps: { color: 'pink-lighten-1', timeout: 2000 },
    })
    return
  }

  if (!user.isLoggedIn) {
    createSnackbar({
      text: '請先登入才能收藏商品 💝',
      snackbarProps: { color: 'orange-darken-2', timeout: 2000 },
    })
    router.push('/login')
    return
  }

  try {
    const { data } = await serviceUser.cart({
      product: props._id,
      quantity: 1,
    })

    console.log('===== 加入購物車後 =====')
    console.log('API 回傳:', data)
    console.log('data.result:', data.result)

    // 更新購物車數量
    user.cart = data.result

    // 👇 重新獲取購物車商品列表
    await user.updateCartItems()

    createSnackbar({
      text: '已成功加入收藏清單 ❤️',
      snackbarProps: { color: 'pink-darken-1', timeout: 2000 },
    })
  } catch (error) {
    console.error('加入收藏失敗:', error)
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({ text, snackbarProps: { color: 'red' } })
  }
}
</script>
