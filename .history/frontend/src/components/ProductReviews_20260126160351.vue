
<template>
  <v-container class="py-0">
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

        <div v-if="product && product.reviews && product.reviews.length > 0">
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
// ... Script 部分保持不變，但可以考慮將 product 改為 props 傳入更乾淨 ...
import { ref, onMounted } from 'vue'
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

const fetchProduct = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    product.value = data.result
  } catch (error) {
    createSnackbar({ text: '讀取評論失敗', snackbarProps: { color: 'red' } })
  }
}

const submitReview = async () => {
  if (!newReview.value.comment) return
  submitting.value = true
  try {
    await api.post(`/product/${route.params.id}/review`, newReview.value)
    createSnackbar({ text: '評論成功！', snackbarProps: { color: 'success' } })
    newReview.value = { rating: 5, comment: '' }
    fetchProduct()
  } catch (error) {
    createSnackbar({ text: '評論失敗', snackbarProps: { color: 'red' } })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>
