<template>
  <v-card
    class="h-100 d-flex flex-column cursor-pointer hover-card bg-white"
    elevation="3"
    @click="goToProduct"
  >
    <v-img
      class="align-end text-white"
      cover
      height="200"
      :src="imageSrc"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
          <v-icon color="grey-lighten-2" size="large">mdi-image-off</v-icon>
        </div>
      </template>
    </v-img>

    <v-card-title class="font-weight-bold text-brown-darken-3 pb-0">
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
        ({{ reviewCount }} 則評論)
      </span>
    </div>

    <v-card-subtitle class="pt-2 text-brown">
      <v-chip
        class="mr-2"
        color="brown"
        label
        size="x-small"
        variant="outlined"
      >
        {{ category }}
      </v-chip>
      <span class="font-weight-bold text-h6">{{ formatedPrice }}</span>
    </v-card-subtitle>

    <v-card-text class="text-grey-darken-1 flex-grow-1">
      {{ description }}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="pink-lighten-1"
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

// ★★★ 關鍵修正：改成接收 id 和 imageUrl (配合你的後端資料) ★★★
const props = defineProps({
  id: { type: String, required: true },       // 改回 id
  imageUrl: { type: String, default: '' },    // 改回 imageUrl
  name: { type: String, required: true },
  category: { type: String, default: '' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
})

// 圖片路徑處理邏輯 (變數改成 imageUrl)
const imageSrc = computed(() => {
  if (!props.imageUrl) return ''
  if (props.imageUrl.startsWith('http')) return props.imageUrl

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return `${API_URL}/upload/${props.imageUrl}`
})

const formatedPrice = computed(() => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(props.price))

const goToProduct = () => {
  // 使用 id 跳轉
  router.push('/product/' + props.id)
}

const addFavorite = async () => {
  if (!user.isLoggedIn) {
    router.push('/login')
    return
  }

  try {
    const { data } = await serviceUser.cart({
      product: props.id, // 傳送 id 給後端
      quantity: 1,
    })

    user.cart = data.result

    createSnackbar({
      text: '已加入收藏清單 ❤️',
      snackbarProps: {
        color: 'pink-darken-1',
        timeout: 2000,
      },
    })
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({
      text,
      snackbarProps: { color: 'red' },
    })
  }
}
</script>

<style scoped lang="sass">
.v-card-text
  white-space: pre
  height: 80px
  overflow-y: hidden
  display: -webkit-box
  -webkit-line-clamp: 3
  -webkit-box-orient: vertical
  overflow: hidden

.hover-card
  transition: transform 0.2s, box-shadow 0.2s
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important
</style>
