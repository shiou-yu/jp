<template>
  <v-container class="py-10 custom-font">
    <v-row v-if="product">
      <v-col cols="12" md="6">
        <v-img :src="imageUrl" class="rounded-xl shadow-sm" cover height="450"></v-img>
      </v-col>

      <v-col cols="12" md="6">
        <v-chip color="blue-grey-lighten-4" class="mb-2 font-weight-bold" size="small" variant="flat">
          {{ product.category }}
        </v-chip>
        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-4 mb-4">{{ product.name }}</h1>

        <div class="d-flex align-center mb-6">
          <v-rating
            :model-value="avgRating"
            active-color="amber"
            color="amber"
            density="compact"
            half-increments
            readonly
          ></v-rating>
          <span class="ml-2 text-blue-grey-lighten-1">({{ reviews.length }} 則評論)</span>
        </div>

        <p class="text-h5 text-blue-grey-darken-3 font-weight-black mb-6">
          NT$ {{ product.price }}
        </p>

        <v-divider class="mb-6"></v-divider>

        <p class="text-body-1 text-blue-grey-darken-1 mb-10" style="line-height: 1.8;">
          {{ product.description }}
        </p>

        <v-btn
          block
          class="rounded-pill font-weight-bold"
          color="pink-lighten-2"
          size="x-large"
          prepend-icon="mdi-heart"
          @click="addFavorite"
        >
          加入收藏清單
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-16">
      <v-col cols="12">
        <h2 class="text-h5 font-weight-bold text-blue-grey-darken-4 mb-6">
          <v-icon icon="mdi-comment-text-multiple-outline" class="mr-2"></v-icon>
          網友評價
        </h2>

        <v-list v-if="reviews.length > 0" bg-color="transparent" class="ga-4 d-flex flex-column">
          <v-card
            v-for="review in reviews"
            :key="review._id"
            class="rounded-xl pa-4"
            elevation="1"
          >
            <div class="d-flex align-center mb-2">
              <v-avatar color="blue-grey-lighten-4" size="36" class="mr-3">
                <v-icon color="white">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-bold text-blue-grey-darken-3">{{ review.user.account }}</div>
                <v-rating
                  :model-value="review.rating"
                  active-color="amber"
                  color="amber"
                  density="compact"
                  readonly
                  size="x-small"
                ></v-rating>
              </div>
              <v-spacer></v-spacer>
              <span class="text-caption text-grey">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
            </div>
            <v-card-text class="pa-0 text-blue-grey-darken-1">
              {{ review.comment }}
            </v-card-text>
          </v-card>
        </v-list>

        <div v-else class="text-center py-10 text-grey">
          目前還沒有評論，快來當第一個評論的人吧！
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/* 保持你原本的 Script 邏輯完全不動 */
// ... (這裡請放你原本的 script setup 內容)
</script>

<style scoped lang="scss">
/* 僅針對字體進行修正，並使用 scss 避免報錯 */

.custom-font {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

/* 確保所有標題、文字與按鈕內容都套用新字體 */
h1, h2, p, span, div, .v-btn, .v-card-text, .v-chip {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

/* 強化日系標題質感 */
h1, h2 {
  font-weight: 700 !important;
  letter-spacing: 0.5px;
}

/* 評論卡片稍微美化以符合字體風格 */
.v-card {
  border: 1px solid #ECEFF1;
}
</style>
