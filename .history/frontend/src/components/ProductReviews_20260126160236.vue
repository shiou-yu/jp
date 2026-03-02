<template>
  <v-container class="py-0">
    <v-divider class="my-10"></v-divider>

    <v-row id="reviews">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold text-blue-grey-darken-3 mb-6">商品評論</h2>

        <v-card v-if="user.isLoggedIn" class="pa-6 rounded-xl border-thin mb-8 muij-bg" elevation="0">
          <p class="font-weight-bold mb-2 text-blue-grey-darken-3">發表你的評價</p>

          <v-rating
            v-model="newReview.rating"
            class="mb-4"
            color="amber"
            empty-icon="mdi-star-outline"
            full-icon="mdi-star"
          ></v-rating>

          <v-textarea
            v-model="newReview.comment"
            bg-color="white"
            class="mb-4 muij-input"
            hide-details
            label="寫下你的心得..."
            rows="3"
            variant="outlined"
          ></v-textarea>

          <v-btn
            class="rounded-lg px-8"
            color="blue-grey-darken-3"
            elevation="0"
            :loading="submitting"
            @click="submitReview"
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
                <v-avatar class="mr-3" color="blue-grey-lighten-4" size="32">
                  <span class="text-caption text-blue-grey-darken-3">{{ r.user.account.charAt(0).toUpperCase() }}</span>
                </v-avatar>
                <span class="font-weight-bold text-blue-grey-darken-4">{{ r.user.account }}</span>
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

        <div v-else class="text-center py-10 text-blue-grey-lighten-3">
          <v-icon class="mb-2" size="large">mdi-comment-outline</v-icon>
          <p>目前還沒有評論，快來當第一個評論的人吧！</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* 無印風灰藍色背景 */
.muij-bg {
  background-color: #f4f5f7 !important; /* 極淺的灰藍色 */
}

.review-item-card {
  background-color: #f9fafb !important;
  border-color: #e2e8f0 !important;
}

/* 讓輸入框邊框更淡一點，符合無印風格 */
.muij-input :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

.review-text {
  line-height: 1.6;
  font-size: 0.95rem;
  white-space: pre-wrap; /* 保留換行 */
}

/* 讓星星間距稍微縮小更精緻 */
:deep(.v-rating__wrapper) {
  margin-right: -4px;
}
</style>
