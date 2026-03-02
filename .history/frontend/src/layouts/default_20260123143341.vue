<script setup>
  import { ref, reactive } from 'vue'

  // --- 1. 資料設定 ---

  // 熱門商品 (輪播圖)
  const hotProducts = ref([
    { title: '全家 濃厚起司米果', image: 'https://cdn.vuetifyjs.com/images/cards/cooking.png' },
    { title: '7-11 半生蘋果乾', image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg' },
    { title: 'Lawson 頂級生乳捲', image: 'https://cdn.vuetifyjs.com/images/cards/forest.jpg' },
  ])

  // 商品列表 (加入 isFavorite 欄位來控制愛心狀態)
  const products = ref([
    {
      id: 1, name: 'PREMIUM ROLL CAKE', price: 150, tag: '甜點',
      rating: 4.5, reviewCount: 12, description: '能盡情品嚐使用100%鮮奶油的奶油！',
      image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
      isFavorite: false // 預設沒收藏
    },
    {
      id: 2, name: '冬日巧克力', price: 244, tag: '甜點',
      rating: 5, reviewCount: 8, description: '一款以生巧克力製成的美味巧克力甜點。',
      image: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
      isFavorite: true // 預設已收藏
    },
    {
      id: 3, name: 'Lawson 炸雞君 (原味)', price: 60, tag: '熟食',
      rating: 4.5, reviewCount: 120, description: '日本便利商店必吃經典，鮮嫩多汁。',
      image: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
      isFavorite: false
    },
    {
      id: 4, name: '伊藤園 濃茶', price: 35, tag: '飲料',
      rating: 4.0, reviewCount: 45, description: '含有豐富兒茶素，回甘不苦澀。',
      image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
      isFavorite: false
    },
  ])

  const breadcrumbs = [
    { title: '首頁', disabled: false, href: '/' },
    { title: '7-11、全家、LAWSON超商', disabled: true, href: '#' }
  ]

  // --- 2. 互動邏輯設定 ---

  // 提示訊息 (Snackbar)
  const snackbar = reactive({
    show: false,
    text: '',
    color: 'success'
  })

  // 評論視窗控制
  const reviewDialog = ref(false)
  const currentReviewProduct = ref(null) // 正在評論哪個商品
  const userReview = reactive({ rating: 5, comment: '' }) // 使用者輸入的內容

  // [功能] 切換收藏狀態
  const toggleFavorite = (product) => {
    product.isFavorite = !product.isFavorite // 切換 true/false

    // 顯示提示
    snackbar.text = product.isFavorite ? `已收藏 ${product.name}` : `已取消收藏 ${product.name}`
    snackbar.color = product.isFavorite ? 'pink-accent-3' : 'grey-darken-1'
    snackbar.show = true
  }

  // [功能] 打開評論視窗
  const openReviewDialog = (product) => {
    currentReviewProduct.value = product
    userReview.rating = 5
    userReview.comment = ''
    reviewDialog.value = true
  }

  // [功能] 送出評論
  const submitReview = () => {
    // 這裡通常會發送 API 給後端，我們用模擬的
    console.log(`送出評論: ${currentReviewProduct.value.name}`, userReview)

    reviewDialog.value = false // 關閉視窗

    // 顯示成功提示
    snackbar.text = '評論發佈成功！謝謝您的分享'
    snackbar.color = 'success'
    snackbar.show = true
  }
</script>

<template>
  <v-container fluid>
    <v-breadcrumbs :items="breadcrumbs" class="px-0 pb-4"></v-breadcrumbs>

    <h1 class="text-h4 font-weight-bold mb-6">7-11、全家、LAWSON超商</h1>

    <v-card class="mb-8 rounded-lg" elevation="2">
      <v-carousel height="300" hide-delimiters show-arrows="hover" cycle interval="5000">
        <template v-slot:prev="{ props }">
          <v-btn variant="text" color="white" icon="mdi-chevron-left" height="60" width="40" @click="props.onClick" class="ms-2" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 20px;"></v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn variant="text" color="white" icon="mdi-chevron-right" height="60" width="40" @click="props.onClick" class="me-2" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 20px;"></v-btn>
        </template>
        <v-carousel-item v-for="(slide, i) in hotProducts" :key="i" :src="slide.image" cover>
          <div class="d-flex fill-height justify-center align-end pb-12">
            <div class="text-h4 text-white font-weight-bold" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.6);">{{ slide.title }}</div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <span class="mr-2 text-grey-darken-1">預設排序</span>
        <v-icon icon="mdi-chevron-down" size="small"></v-icon>
      </div>
      <div class="text-grey-darken-1">共 {{ products.length }} 件商品</div>
    </div>

    <v-row>
      <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto rounded-lg d-flex flex-column fill-height" elevation="1" hover color="white">
          <v-img :src="product.image" height="200px" cover></v-img>

          <div class="d-flex flex-column flex-grow-1 pa-4">
            <div class="text-h6 font-weight-bold text-grey-darken-3 mb-1 text-truncate">{{ product.name }}</div>

            <div class="d-flex align-center mb-3">
              <v-rating v-model="product.rating" color="amber-lighten-1" active-color="amber" density="compact" size="small" readonly half-increments></v-rating>
              <span class="text-grey text-caption ms-2">({{ product.reviewCount }})</span>
            </div>

            <div class="d-flex align-center mb-3">
              <v-chip variant="outlined" size="small" color="grey" class="me-3 px-2 rounded">{{ product.tag }}</v-chip>
              <span class="text-h5 font-weight-bold text-grey-darken-2">${{ product.price }}</span>
            </div>

            <div class="text-body-2 text-grey-darken-1 mb-2">{{ product.description }}</div>

            <div class="d-flex justify-space-between align-center mt-auto pt-2">
              <v-btn
                prepend-icon="mdi-pencil-outline"
                variant="tonal"
                color="primary"
                size="small"
                class="px-3"
                @click="openReviewDialog(product)"
              >
                寫評論
              </v-btn>

              <v-btn
                :icon="product.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                :color="product.isFavorite ? 'pink-accent-3' : 'grey-lighten-1'"
                variant="text"
                density="comfortable"
                @click="toggleFavorite(product)"
              ></v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="reviewDialog" max-width="500">
      <v-card v-if="currentReviewProduct">
        <v-card-title class="text-h5 font-weight-bold pt-4">
          評論：{{ currentReviewProduct.name }}
        </v-card-title>

        <v-card-text>
          <div class="mb-2">您對這個商品的評價是？</div>
          <div class="d-flex justify-center mb-4">
            <v-rating v-model="userReview.rating" color="amber" size="large" hover></v-rating>
          </div>

          <v-textarea
            v-model="userReview.comment"
            label="寫下您的心得..."
            variant="outlined"
            rows="3"
            placeholder="口感如何？推薦嗎？"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pb-4 px-4">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="reviewDialog = false">取消</v-btn>
          <v-btn color="primary" variant="elevated" @click="submitReview">送出評論</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2000"
      location="bottom right"
    >
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn icon="mdi-close" variant="text" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>
