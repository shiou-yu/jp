<template>
  <v-container class="py-0">
    <v-divider class="my-10"></v-divider>

    <v-row id="reviews">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold text-blue-grey-darken-3 mb-6">商品評論</h2>

        <v-card
          v-if="user.isLoggedIn"
          class="pa-6 rounded-xl border-thin mb-8 muij-bg"
          elevation="0"
        >
          <p class="font-weight-bold mb-2 text-blue-grey-darken-3">發表你的評價</p>

          <v-rating
            v-model="newReview.rating"
            color="amber"
            empty-icon="mdi-star-outline"
            full-icon="mdi-star"
            class="mb-4"
          ></v-rating>

          <v-textarea
            v-model="newReview.comment"
            label="寫下你的心得..."
            variant="outlined"
            bg-color="white"
            rows="3"
            hide-details
            class="mb-4 muij-input"
          ></v-textarea>

          <v-btn
            color="blue-grey-darken-3"
            :loading="submitting"
            @click="submitReview"
            class="px-6 rounded-lg"
            elevation="0"
          >
            送出評論
          </v-btn>
        </v-card>

        <v-alert
          v-else
          class="rounded-lg mb-8"
          color="blue-grey"
          type="info"
          variant="tonal"
        >
          請先登入後即可發表評論。
        </v-alert>

        <div v-if="product && product.reviews && product.reviews.length > 0">
          <v-card
            v-for="r in product.reviews"
            :key="r._id"
            class="mb-4 pa-5 rounded-xl border-thin review-item-card"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-center mb-3">
              <div class="d-flex align-center">
                <v-avatar color="blue-grey-lighten-4" size="32" class="mr-3">
                  <span class="text-caption text-blue-grey-darken-3">
                    {{ r.user.account ? r.user.account.charAt(0).toUpperCase() : 'U' }}
                  </span>
                </v-avatar>
                <span class="font-weight-bold text-blue-grey-darken-4">{{ r.user.account }}</span>
              </div>

              <v-rating
                color="amber"
                density="compact"
                :model-value="r.rating"
                readonly
                size="x-small"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
              ></v-rating>
            </div>
            <p class="text-blue-grey-darken-2 review-text">{{ r.comment }}</p>
          </v-card>
        </div>

        <div v-else class="text-center py-10 text-blue-grey-lighten-2">
          <v-icon size="large" class="mb-2">mdi-comment-outline</v-icon>
          <p>目前還沒有評論，快來當第一個評論的人吧！</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { api } from '@/plugins/axios'
import { useUserStore } from '@/stores/user'

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

<style scoped>
/* 無印風灰藍色背景 */
.muij-bg {
  background-color: #f4f5f7 !important; /* 極淺的灰藍色 */
}

/* 評論卡片樣式 */
.review-item-card {
  background-color: #f9fafb !important;
  border-color: #e2e8f0 !important;
}

/* 讓輸入框邊框更淡一點，符合無印風格 */
.muij-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

/* 評論文字優化 */
.review-text {
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap; /* 保留換行 */
}

/* 調整星星的對齊 */
:deep(.v-rating__wrapper) {
  margin-right: -2px;
}
</style>
