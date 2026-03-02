<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-img aspect-ratio="1" class="rounded-xl elevation-3 bg-white" cover :src="productImageUrl"></v-img>
      </v-col>

      <v-col class="d-flex flex-column justify-center" cols="12" md="6">
        <div class="mb-2">
          <v-chip class="font-weight-bold" color="amber-darken-4" label size="small">{{ product.category }}</v-chip>
        </div>
        <h1 class="text-h4 font-weight-bold text-brown-darken-2 mb-2">{{ product.name }}</h1>

        <div class="text-h5 text-red-darken-1 mb-6 font-weight-bold">{{ currency(product.price) }}</div>

        <div class="text-body-1 text-grey-darken-3 mb-8" style="white-space: pre-wrap; line-height: 1.8;">{{ product.description }}</div>

        <div>
          <v-btn
            class="text-white font-weight-bold px-8 elevation-4"
            color="pink-accent-2"
            :loading="loadingFavorite"
            prepend-icon="mdi-heart"
            rounded="xl"
            size="x-large"
            @click="addFavorite"
          >
            加入收藏清單
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-divider class="my-12 border-opacity-50" color="brown-lighten-2" thickness="2"></v-divider>

    <div v-if="product._id">
      <ProductReviews
        :id="product._id"
        :image="product.image"
        :name="product.name"
      ></ProductReviews>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductReviews from '@/components/ProductReviews.vue'
import { api } from '@/plugins/axios'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

const product = ref({
  _id: '',
  name: '',
  price: 0,
  priceJP: '', // 確保接收後端的虛擬欄位
  description: '',
  image: '',
  category: '',
})

// 處理詳細頁大圖的 Cloudinary 網址
const productImageUrl = computed(() => {
  if (!product.value.image) return 'https://via.placeholder.com/400?text=No+Image'
  if (product.value.image.startsWith('http')) return product.value.image

  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${product.value.image}`
})

const loadingFavorite = ref(false)

// --- 修正：日圓格式化函式 ---
const currency = (val) => {
  // 優先使用後端 Mongoose 算好的 priceJP (例如 ￥280)
  if (product.value.priceJP) return product.value.priceJP

  // 如果後端尚未回傳或沒定義，手動加上 ￥ 符號，不再使用 TWD 格式
  return `￥${val}`
}

const getProduct = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    product.value = data.result
  } catch (error) {
    console.error(error)
    createSnackbar({ text: '找不到該商品', snackbarProps: { color: 'red' } })
    router.push('/')
  }
}

const addFavorite = async () => {
  if (!user.isLoggedIn) {
    router.push('/login')
    return
  }
  loadingFavorite.value = true
  try {
    const { data } = await serviceUser.cart({ product: product.value._id, quantity: 1 })
    user.cart = data.result
    createSnackbar({ text: '已加入收藏清單 ❤️', snackbarProps: { color: 'pink-darken-1', timeout: 2000 } })
  } catch {
    createSnackbar({ text: '加入失敗', snackbarProps: { color: 'red' } })
  } finally {
    loadingFavorite.value = false
  }
}

onMounted(() => {
  getProduct()
})
</script>

<style scoped>
/* 可以在這裡加入額外的樣式 */
</style>
