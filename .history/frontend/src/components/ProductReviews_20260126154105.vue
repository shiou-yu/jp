<template>
  <v-container class="py-10" v-if="product">
    <v-row>
      <v-col cols="12" md="6">
        <v-img :src="imageUrl" class="rounded-xl elevation-2" cover height="400"></v-img>
      </v-col>

      <v-col cols="12" md="6">
        <v-chip color="blue-grey-lighten-2" class="mb-2" variant="flat" size="small">{{ product.category }}</v-chip>
        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3 mb-4">{{ product.name }}</h1>
        <div class="d-flex align-center mb-4">
          <v-rating :model-value="product.rating" color="amber" density="compact" readonly half-increments></v-rating>
          <span class="text-grey ml-2">({{ product.reviewCount || 0 }} 則評論)</span>
        </div>
        <p class="text-h5 text-orange-darken-3 font-weight-bold mb-6">{{ formatedPrice }}</p>
        <p class="text-blue-grey-darken-1 mb-8" style="line-height: 1.8;">{{ product.description }}</p>

        <v-btn color="pink-lighten-2" size="large" prepend-icon="mdi-heart" @click="addFavorite" block rounded="lg">
          加入收藏清單
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <v-row id="reviews">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold text-blue-grey-darken-3 mb-6">商品評論</h2>

        <v-card v-if="user.isLoggedIn" class="pa-6 rounded-xl border-thin mb-8" elevation="0">
          <p class="font-weight-bold mb-2">發表你的評價</p>
          <v-rating v-model="newReview.rating" color="amber" class="mb-4"></v-rating>
          <v-textarea
            v-model="newReview.comment"
            label="寫下你的心得..."
            variant="outlined"
            bg-color="grey-lighten-5"
            rows="3"
            hide-details
            class="mb-4"
          ></v-textarea>
          <v-btn color="blue-grey-darken-3" :loading="submitting" @click="submitReview">送出評論</v-btn>
        </v-card>

        <v-alert v-else type="info" variant="tonal" class="rounded-lg mb-8" color="blue-grey">
          請先登入後即可發表評論。
        </v-alert>

        <div v-if="product.reviews && product.reviews.length > 0">
          <v-card v-for="r in product.reviews" :key="r._id" class="mb-4 pa-4 rounded-lg" variant="outlined">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="font-weight-bold">{{ r.user.account }}</span>
              <v-rating :model-value="r.rating" color="amber" density="compact" size="x-small" readonly></v-rating>
            </div>
            <p class="text-blue-grey-darken-1">{{ r.comment }}</p>
          </v-card>
        </div>
        <div v-else class="text-center py-10 text-grey">
          目前還沒有評論，快來當第一個評論的人吧！
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { api } from '@/plugins/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const route = useRoute()
const user = useUserStore()
const createSnackbar = useSnackbar()

const product = ref(null)
const submitting = ref(false)
const newReview = ref({ rating: 5, comment: '' })

const imageUrl = computed(() => {
  if (!product.value?.image) return ''
  return product.value.image.startsWith('http')
    ? product.value.image
    : `https://res.cloudinary.com/dyosa5byh/image/upload/${product.value.image}`
})

const formatedPrice = computed(() =>
  new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(product.value?.price || 0)
)

const fetchProduct = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    product.value = data.result
  } catch (error) {
    createSnackbar({ text: '讀取商品失敗', snackbarProps: { color: 'red' } })
  }
}

const submitReview = async () => {
  if (!newReview.value.comment) return
  submitting.value = true
  try {
    await api.post(`/product/${route.params.id}/review`, newReview.value)
    createSnackbar({ text: '評論成功！', snackbarProps: { color: 'success' } })
    newReview.value = { rating: 5, comment: '' }
    fetchProduct() // 重新刷新評論列表
  } catch (error) {
    createSnackbar({ text: '評論失敗', snackbarProps: { color: 'red' } })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
/* 這裡沒有任何 font-family，會自動回到預設字體 */
</style>
