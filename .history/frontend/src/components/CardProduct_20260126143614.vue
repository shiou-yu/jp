<template>
  <v-card
    class="h-100 d-flex flex-column cursor-pointer hover-card bg-white rounded-xl"
    elevation="2"
    @click="goToProduct"
  >
    <v-img
      class="align-end text-white rounded-t-xl"
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

    <v-card-title class="font-weight-bold text-blue-grey-darken-4 pb-0 custom-font">
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
      <span class="text-caption text-blue-grey-lighten-2 ml-1 custom-font">
        ({{ reviewCount }} 則評論)
      </span>
    </div>

    <v-card-subtitle class="pt-2 d-flex align-center justify-space-between">
      <v-chip
        class="custom-font font-weight-bold"
        color="blue-grey-lighten-4"
        size="x-small"
        variant="flat"
        label
      >
        {{ category }}
      </v-chip>
      <span class="font-weight-bold text-h6 text-blue-grey-darken-3 custom-font">{{ formatedPrice }}</span>
    </v-card-subtitle>

    <v-card-text class="text-blue-grey-darken-1 flex-grow-1 custom-font mt-2">
      {{ description }}
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-spacer></v-spacer>
      <v-btn
        color="pink-lighten-2"
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

const imageUrl = computed(() => {
  if (!props.image) return 'https://via.placeholder.com/200?text=No+Image'
  if (props.image.startsWith('http')) return props.image
  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${props.image}`
})

const formatedPrice = computed(() =>
  new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(props.price)
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

<style scoped lang="scss">
/* 使用 SCSS 語法，更穩定且支援括號與分號 */
.custom-font {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

.v-card-title {
  font-size: 1.15rem;
  line-height: 1.4;
}

.v-card-text {
  // 修正文字截斷邏輯
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 48px;
  line-height: 1.5;
  white-space: normal; // 確保文字可以換行後截斷
}

.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #ECEFF1 !important;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
  }
}
</style>
