<script setup>
  import { ref } from 'vue'

  // 1. 熱門商品 (輪播圖資料)
  const hotProducts = ref([
    {
      title: '全家 濃厚起司米果',
      image: 'https://cdn.vuetifyjs.com/images/cards/cooking.png'
    },
    {
      title: '7-11 半生蘋果乾',
      image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'
    },
    {
      title: 'Lawson 頂級生乳捲',
      image: 'https://cdn.vuetifyjs.com/images/cards/forest.jpg'
    },
  ])

  // 2. 商品列表資料
  const products = ref([
    {
      id: 1,
      name: 'PREMIUM ROLL CAKE',
      price: 150,
      tag: '甜點',
      rating: 0,
      reviewCount: 0,
      description: '能盡情品嚐使用100%鮮奶油的奶油！口感綿密順滑。',
      image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg'
    },
    {
      id: 2,
      name: '冬日巧克力',
      price: 244,
      tag: '甜點',
      rating: 5,
      reviewCount: 1,
      description: '一款以生巧克力製成的美味巧克力甜點，入口即化。',
      image: 'https://cdn.vuetifyjs.com/images/cards/house.jpg'
    },
    {
      id: 3,
      name: 'Lawson 炸雞君 (原味)',
      price: 60,
      tag: '熟食',
      rating: 4.5,
      reviewCount: 120,
      description: '日本便利商店必吃經典，鮮嫩多汁，外皮酥脆。',
      image: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
    },
    {
      id: 4,
      name: '伊藤園 濃茶',
      price: 35,
      tag: '飲料',
      rating: 4.0,
      reviewCount: 45,
      description: '含有豐富兒茶素，回甘不苦澀，健康無糖綠茶首選。',
      image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg'
    },
  ])

  // 3. 麵包屑導航
  const breadcrumbs = [
    { title: '首頁', disabled: false, href: '/' },
    { title: '7-11、全家、LAWSON超商', disabled: true, href: '#' }
  ]

  // 4. 收藏功能 (模擬)
  const toggleFavorite = (id) => {
    console.log('點擊收藏 ID:', id)
    // 這裡之後可以寫入 Pinia 或 LocalStorage
  }
</script>

<template>
  <v-container fluid>
    <v-breadcrumbs :items="breadcrumbs" class="px-0 pb-4"></v-breadcrumbs>

    <h1 class="text-h4 font-weight-bold mb-6">7-11、全家、LAWSON超商</h1>

    <v-card class="mb-8 rounded-lg" elevation="2">
      <v-carousel
        height="300"
        hide-delimiters
        show-arrows="hover"
        cycle
        interval="5000"
      >
        <template v-slot:prev="{ props }">
          <v-btn
            variant="text"
            color="white"
            icon="mdi-chevron-left"
            height="60"
            width="40"
            @click="props.onClick"
            class="ms-2"
            style="background-color: rgba(0, 0, 0, 0.5); border-radius: 20px;"
          ></v-btn>
        </template>

        <template v-slot:next="{ props }">
          <v-btn
            variant="text"
            color="white"
            icon="mdi-chevron-right"
            height="60"
            width="40"
            @click="props.onClick"
            class="me-2"
            style="background-color: rgba(0, 0, 0, 0.5); border-radius: 20px;"
          ></v-btn>
        </template>

        <v-carousel-item
          v-for="(slide, i) in hotProducts"
          :key="i"
          :src="slide.image"
          cover
        >
          <div class="d-flex fill-height justify-center align-end pb-12">
            <div
              class="text-h4 text-white font-weight-bold"
              style="text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6)"
            >
              {{ slide.title }}
            </div>
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
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="mx-auto rounded-lg d-flex flex-column fill-height"
          elevation="1"
          hover
          color="white"
          :to="`/product/${product.id}`"
        >
          <v-img :src="product.image" height="200px" cover></v-img>

          <div class="d-flex flex-column flex-grow-1 pa-4">
            <div class="text-h6 font-weight-bold text-grey-darken-3 mb-1 text-truncate">
              {{ product.name }}
            </div>

            <div class="d-flex align-center mb-3">
              <v-rating
                v-model="product.rating"
                color="amber-lighten-1"
                active-color="amber"
                empty-icon="mdi-star-outline"
                full-icon="mdi-star"
                half-increments
                readonly
                density="compact"
                size="small"
              ></v-rating>
              <span class="text-grey text-caption ms-2">
                ({{ product.reviewCount }} 則評論)
              </span>
            </div>

            <div class="d-flex align-center mb-3">
              <v-chip
                variant="outlined"
                size="small"
                color="grey"
                class="me-3 px-2 rounded"
                style="border-color: #ddd"
              >
                {{ product.tag }}
              </v-chip>
              <span class="text-h5 font-weight-bold text-grey-darken-2">
                ${{ product.price }}
              </span>
            </div>

            <div class="text-body-2 text-grey-darken-1 mb-2">
              {{ product.description }}
            </div>

            <div class="d-flex justify-end mt-auto">
              <v-btn
                icon="mdi-heart"
                color="pink-accent-2"
                variant="text"
                density="comfortable"
                @click.prevent="toggleFavorite(product.id)"
              ></v-btn>
              </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
