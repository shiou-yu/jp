<template>
    <v-card
    class="h-100 d-flex flex-column cursor-pointer hover-card bg-white rounded-xl"

    elevation="2"

    @click="goToProduct"
  >
        <v-img
          class="align-end text-white"

          cover

          height="200"

          :src="imageUrl"
        >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
          <v-icon color="grey-lighten-2" size="large">mdi-image-off</v-icon>
        </div>
      </template>
    </v-img>

        <v-card-title class="font-weight-bold text-blue-grey-darken-4 pb-0 pt-3">
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

        <v-card-subtitle class="pt-2 d-flex align-center">
            <v-chip

              class="mr-2 font-weight-bold"

              color="blue-grey-lighten-1"

              label

              size="x-small"

              variant="flat"
            >
        {{ category }}
      </v-chip>
            <span class="font-weight-bold text-h6 text-orange-darken-3">{{ formatedPrice }}</span>
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
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
})

// Cloudinary 網址拼接
const imageUrl = computed(() => {
  if (!props.image) return 'https://via.placeholder.com/200?text=No+Image'
  if (props.image.startsWith('http')) return props.image
  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${props.image}`
})

// 價格格式化
const formatedPrice = computed(() =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(props.price),
)

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
/* 商品描述文字截斷處理 */
.product-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制顯示兩行，看起來更簡潔 */
  -webkit-box-orient: vertical;
  height: 48px; /* 固定高度防止卡片跳動 */
  line-height: 1.5;
  margin-bottom: 8px;
}

/* 卡片懸停效果 */
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
