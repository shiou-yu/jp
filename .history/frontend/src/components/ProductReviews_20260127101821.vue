<template>
  <v-container class="py-0">
    <v-divider class="my-10"></v-divider>

    <v-row id="reviews" justify="center">
      <v-col cols="12" lg="6" md="8">
        <h2 class="text-h6 font-weight-bold text-blue-grey-darken-3 mb-6">商品評論</h2>

        <v-card
          v-if="user.isLoggedIn"
          class="pa-5 rounded-xl border-thin mb-8 muij-bg"
          elevation="0"
        >
          <p class="text-subtitle-2 font-weight-bold mb-2 text-blue-grey-darken-3">發表你的評價</p>

          <v-rating
            v-model="newReview.rating"
            active-color="amber"
            class="mb-3"
            color="blue-grey-lighten-2"
            density="comfortable"
            empty-icon="mdi-star-outline"
            full-icon="mdi-star"
            hover
            size="small"
          ></v-rating>

          <v-textarea
            v-model="newReview.comment"
            bg-color="white"
            class="mb-4 muij-input"
            hide-details
            label="寫下你的心得..."
            rows="2"
            variant="outlined"
          ></v-textarea>

          <v-btn
            class="px-6 rounded-lg"
            color="blue-grey-darken-3"
            elevation="0"
            :loading="submitting"
            size="small"
            @click="submitReview"
          >
            送出評論
          </v-btn>
        </v-card>

        <v-alert
          v-else
          class="mb-8 rounded-lg"
          color="blue-grey-darken-1"
          density="comfortable"
          icon="mdi-account-alert"
          variant="tonal"
        >
          <div class="text-subtitle-2 font-weight-bold">尚未登入</div>
          <div class="text-caption">您需要登入會員後才能發表評論。</div>
        </v-alert>

        <div v-if="product && product.reviews && product.reviews.length > 0">
          <v-card
            v-for="r in product.reviews"
            :key="r._id"
            class="mb-4 pa-4 rounded-xl border-thin review-item-card"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <v-avatar class="mr-2" color="blue-grey-lighten-4" size="28">
                  <span class="text-caption text-blue-grey-darken-3">
                    {{ r.user?.account ? r.user.account.charAt(0).toUpperCase() : 'U' }}
                  </span>
                </v-avatar>
                <span class="text-body-2 font-weight-bold text-blue-grey-darken-4">
                  {{ r.user?.account || '未知使用者' }}
                </span>
              </div>

              <v-rating
                color="amber"
                density="compact"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                :model-value="r.rating"
                readonly
                size="x-small"
              ></v-rating>
            </div>

            <p class="text-blue-grey-darken-2 review-text">{{ r.comment }}</p>
          </v-card>
        </div>

        <div v-else class="text-center py-10 text-blue-grey-lighten-2">
          <v-icon class="mb-2" size="large">mdi-comment-outline</v-icon>
          <p class="text-body-2">目前還沒有評論，快來當第一個評論的人吧！</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { api, apiAuth } from '@/plugins/axios'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const user = useUserStore()
const createSnackbar = useSnackbar()

const product = ref(null)
const submitting = ref(false)
const newReview = ref({ rating: 0, comment: '' })

const fetchProduct = async () => {
  try {
    const { data } = await api.get('/product/' + route.params.id)
    product.value = data.result
  } catch {
    createSnackbar({ text: '讀取評論失敗', snackbarProps: { color: 'red' } })
  }
}

const submitReview = async () => {
  if (newReview.value.rating === 0) {
    createSnackbar({ text: '請點選星星進行評分', snackbarProps: { color: 'warning' } })
    return
  }
  if (!newReview.value.comment) {
    createSnackbar({ text: '請輸入評論內容', snackbarProps: { color: 'warning' } })
    return
  }

  submitting.value = true
  try {
    await apiAuth.post(`/product/${route.params.id}/review`, newReview.value)
    createSnackbar({ text: '評論成功！', snackbarProps: { color: 'success' } })
    newReview.value = { rating: 0, comment: '' }
    fetchProduct()
  } catch (error) {
    console.log(error)
    createSnackbar({ text: '評論失敗', snackbarProps: { color: 'red' } })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.muij-bg {
  background-color: #f4f5f7 !important;
}

.review-item-card {
  background-color: #f9fafb !important;
  border-color: #e2e8f0 !important;
}

/* 移除輸入框多餘的邊界感 */
.muij-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.2;
}

.review-text {
  line-height: 1.5;
  font-size: 0.875rem; /* 稍微縮小字體讓區塊不顯得臃腫 */
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.v-rating__wrapper) {
  margin-right: -1px;
}
</style>
