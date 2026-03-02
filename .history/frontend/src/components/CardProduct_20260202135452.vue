<template>
  <v-card
    class="h-100 d-flex flex-column cursor-pointer hover-card bg-white rounded-xl"
    elevation="2"
    @click="goToProduct"
  >
    <v-img
      class="align-end text-white product-image"
      cover
      :src="imageUrl"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
          <v-icon color="grey-lighten-2" size="large">mdi-image-off</v-icon>
        </div>
      </template>

      <!-- 已收藏標籤 -->
      <v-chip
        v-if="isFavorite"
        class="favorite-badge"
        color="pink"
        label
        size="small"
      >
        <v-icon start size="small">mdi-heart</v-icon>
        已收藏
      </v-chip>
    </v-img>

    <v-card-title class="font-weight-bold text-blue-grey-darken-4 pb-0 pt-3 product-title">
      {{ name }}
    </v-card-title>

    <div class="px-4 py-1 d-flex align-center">
      <v-rating
        active-color="amber"
        color="amber"
        density="compact"
        half-increments
        :model-value="rating"
        readonly
        size="x-small"
      ></v-rating>
      <span class="text-caption text-grey ml-1">
        ({{ reviewCount }})
      </span>
    </div>

    <v-card-subtitle class="pt-2 d-flex align-center flex-wrap">
      <v-chip
        class="mr-2 mb-1 font-weight-bold"
        color="blue-grey-lighten-1"
        label
        size="x-small"
        variant="flat"
      >
        {{ category }}
      </v-chip>
      <span class="font-weight-bold text-h6 text-orange-darken-3 price-text">{{ formatedPrice }}</span>
    </v-card-subtitle>

    <v-card-text class="text-blue-grey-darken-1 flex-grow-1 product-description">
      {{ description }}
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>

      <!-- 愛心按鈕 -->
      <v-btn
        class="favorite-btn"
        :class="{ 'is-favorite': isFavorite, 'is-locked': isFavorite }"
        icon
        variant="text"
        @click.stop="addFavorite"
      >
        <v-icon :color="isFavorite ? '#E91E63' : '#F48FB1'">
          {{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

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

  // 檢查 cartItems 陣列中是否有這個商品
  return user.cartItems.some(item => {
    // 根據後端回傳的資料結構調整
    // 可能是 item.product._id 或 item.product 或 item._id
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

    // 更新購物車數量
    user.cart = data.result

    // 👇 重新獲取購物車商品列表
    await user.updateCartItems()

    createSnackbar({
      text: '已成功加入收藏清單 ❤️',
      snackbarProps: { color: 'pink-darken-1', timeout: 2000 },
    })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({ text, snackbarProps: { color: 'red' } })
  }
}
</script>

<style scoped>
/* 預設圖片高度 */
.product-image {
  height: 200px;
  position: relative;
}

/* 已收藏標籤 */
.favorite-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  font-weight: bold;
  animation: fadeInScale 0.4s ease-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 標題文字優化 */
.product-title {
  font-size: 1.1rem;
  line-height: 1.4;
  white-space: normal;
}

/* 商品描述文字截斷處理 */
.product-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  min-height: 3em;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.hover-card {
  transition: all 0.3s ease;
}

@media (min-width: 600px) {
  .hover-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
}

/* ❤️ 愛心按鈕樣式 */
.favorite-btn {
  transition: all 0.3s ease;
}

.favorite-btn .v-icon {
  font-size: 24px !important;
}

/* 未收藏狀態 */
.favorite-btn:not(.is-favorite):hover {
  transform: scale(1.15);
}

/* 已收藏狀態 - 鎖定 */
.favorite-btn.is-locked {
  pointer-events: none;
  cursor: not-allowed;
}

/* 點擊反饋 */
.favorite-btn:not(.is-favorite):active {
  transform: scale(0.9);
}

@media (max-width: 600px) {
  .product-image {
    height: 160px;
  }
  .product-title {
    font-size: 1rem;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .price-text {
    font-size: 1.1rem !important;
  }
  .product-description {
    font-size: 0.85rem;
    padding: 8px 12px !important;
  }
  .favorite-badge {
    font-size: 0.7rem;
    top: 8px;
    right: 8px;
  }
}
</style>
