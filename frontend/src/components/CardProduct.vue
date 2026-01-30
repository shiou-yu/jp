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
      <v-btn
        color="pink-lighten-3"
        icon="mdi-heart"
        variant="text"
        @click.stop="addFavorite"
      ></v-btn>
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
  // 新增接收後端的日圓虛擬欄位
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

// 修改：不再使用 TWD 格式化，改用後端算好的 priceJP
const formatedPrice = computed(() => {
  // 優先使用後端傳來的 "￥320"，若還沒抓到則用 props.price 加上符號兜底
  return props.priceJP || `￥${props.price}`
})

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

<style scoped>
/* 預設圖片高度 */
.product-image {
  height: 200px;
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
}
</style>
