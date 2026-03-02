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
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
})

// ★ 終極修正：處理 Cloudinary 圖片路徑
const imageUrl = computed(() => {
  if (!props.image) return 'https://via.placeholder.com/200?text=No+Image'

  // 1. 如果資料庫存的是完整網址 (https://res.cloudinary.com/...)
  if (props.image.startsWith('http')) {
    return props.image
  }

  // 2. 如果資料庫存的是 filename (Public ID)，拼接網址
  // 注意：請將下方的 '你的CloudName' 替換成你後端 .env 裡的 CLOUDINARY_CLOUD_NAME 實際文字
  // 例如：const cloudName = 'dxyabc123'
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '你的CloudName'

  const finalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${props.image}`

  // 這裡可以幫你在瀏覽器 Console 檢查產生的網址對不對
  console.log('目前商品：', props.name, '產生的網址：', finalUrl)

  return finalUrl
})

const formatedPrice = computed(() => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(props.price))

const goToProduct = () => {
  router.push('/product/' + props._id)
}

const addFavorite = async () => {
  if (!user.isLoggedIn) {
    router.push('/login')
    return
  }
  try {
    const { data } = await serviceUser.cart({
      product: props._id,
      quantity: 1,
    })
    user.cart = data.result
    createSnackbar({
      text: '已加入收藏清單 ❤️',
      snackbarProps: { color: 'pink-darken-1', timeout: 2000 },
    })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({ text, snackbarProps: { color: 'red' } })
  }
}
</script>
