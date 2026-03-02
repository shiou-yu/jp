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
      :src="image"
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

// ★ 重點修正：對齊後端資料欄位名稱
// 通常 MongoDB 回傳的是 "_id" 和 "image"，而不是 "id" 和 "imageUrl"
const props = defineProps({
  _id: { type: String, required: true }, // 改成接收 _id
  image: { type: String, required: true }, // 改成接收 image
  name: { type: String, required: true },
  category: { type: String, default: '' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
})

const formatedPrice = computed(() => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(props.price))

// 跳轉到商品內頁
const goToProduct = () => {
  // ★ 修正：使用 _id 進行跳轉
  router.push('/product/' + props._id)
}

// 加入收藏
const addFavorite = async () => {
  if (!user.isLoggedIn) {
    router.push('/login')
    return
  }

  try {
    // 注意：你目前呼叫的是「購物車」API (serviceUser.cart)
    // 如果你要做的是純收藏清單，這裡可能需要改成 serviceUser.addFavorite(props._id) 之類的
    const { data } = await serviceUser.cart({
      product: props._id, // ★ 修正：傳送 _id
      quantity: 1,
      // replace: false, // 收藏通常不需要 replace，視你後端邏輯而定
    })

    // 如果後端回傳購物車結果，這裡更新購物車數量是合理的
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
