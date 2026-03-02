<template>
  <!-- 滿版輪播區 -->
  <v-carousel
    class="fullscreen-carousel"
    cycle
    height="100vh"
    hide-delimiters
    :interval="2000"
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
      cover
      :src="slide.src"
    >
      <!-- 文字覆蓋層（右下角）-->
      <v-container class="carousel-content fill-height">
        <v-row align="end" class="pb-20 pr-1" justify="end">
          <v-col cols="auto">
            <!-- 雲朵卡片 -->
            <div class="cloud-wrapper" style="margin-top: 40px;">
              <div class="cloud-card">
                <!-- 主標題 -->
                <h2 class="cloud-title">
                  {{ slide.title }}
                </h2>

                <!-- 副標題 -->
                <p class="cloud-subtitle">
                  {{ slide.subtitle }}
                </p>

                <!-- 按鈕 -->
                <v-btn
                  class="explore-btn mt-2"
                  color="#5DADE2"
                  rounded="pill"
                  size="small"
                  variant="flat"
                  @click="scrollToProducts"
                >
                  <v-icon class="mr-1" size="small">mdi-compass</v-icon>
                  立即探索
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
  </v-carousel>

  <!-- 商品區域 -->
  <v-container ref="productsSection" class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          熱門人氣必吃
        </h1>
        <p class="text-blue-grey-darken-1 mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          bg-color="white"
          class="rounded-lg elevation-1"
          clearable
          color="blue-grey-darken-3"
          flat
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          @click:clear="onClearSearch"
          @input="onSearchInput"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="blue-grey-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip class="font-weight-bold px-4 rounded-pill" filter value="全部" variant="flat">全部</v-chip>
          <v-chip
            color="pink-lighten-4"
            filter
            selected-class="text-white"
            value="甜點"
            variant="flat"
          >甜點 🍰</v-chip>
          <v-chip color="orange-lighten-4" filter value="零食" variant="flat">零食 🍪</v-chip>
          <v-chip color="amber-lighten-4" filter value="熟食" variant="flat">熟食 🍱</v-chip>
          <v-chip color="blue-lighten-4" filter value="冰品" variant="flat">冰品 🍦</v-chip>
          <v-chip color="red-lighten-4" filter value="泡麵" variant="flat">泡麵 🍜</v-chip>
        </v-chip-group>

        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>

        <v-chip-group v-model="store" @update:model-value="fetchProducts">
          <v-chip class="font-weight-black rounded-lg px-5" selected-class="bg-deep-orange-darken-2 text-white" value="7-11" variant="flat">7-11</v-chip>
          <v-chip class="font-weight-black rounded-lg px-5" selected-class="bg-green-darken-2 text-white" value="全家" variant="flat">全家</v-chip>
          <v-chip class="font-weight-black rounded-lg px-5" selected-class="bg-blue-darken-2 text-white" value="Lawson" variant="flat">Lawson</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="loading" cols="12">
        <div class="text-center py-10">
          <v-progress-circular color="blue-grey-lighten-2" indeterminate size="64"></v-progress-circular>
          <div class="text-grey mt-4">正在搬運商品中...</div>
        </div>
      </v-col>

      <v-col v-else-if="products.length === 0" cols="12">
        <div class="text-center text-grey py-10 bg-white rounded-xl border-dashed-custom">
          <v-icon class="mb-2" color="blue-grey-lighten-3" size="64">mdi-package-variant-closed</v-icon>
          <h3>目前沒有商品上架</h3>
        </div>
      </v-col>

      <v-col
        v-for="product in products"
        v-else
        :key="product._id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <ProductCard v-bind="product" :review-count="product.reviewCount || 0" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/CardProduct.vue'
import { api } from '@/plugins/axios'

const { mobile } = useDisplay()
const createSnackbar = useSnackbar()
const products = ref([])
const loading = ref(true)
const productsSection = ref(null)

// 滿版輪播內容
const slides = ref([
  {
    src: '/banner-01.jpg',
    title: '日本超商挖到寶',
    subtitle: '發現你的日常小確幸',
  },
  {
    src: '/banner-02.jpg',
    title: '限定美味登場',
    subtitle: '每一口都是驚喜',
  },
  {
    src: '/banner-03.jpg',
    title: '人氣必吃推薦',
    subtitle: '大家都在買的收藏名單',
  },
  {
    src: '/banner-04.png',
    title: '季節限定特選',
    subtitle: '不容錯過的絕品好物',
  },
  {
    src: '/banner-05.jpg',
    title: '超商美食指南',
    subtitle: '品味日本的便利生活',
  },
])

const search = ref('')
const category = ref('全部')
const store = ref(null)

// 平滑滾動到商品區
const scrollToProducts = () => {
  productsSection.value?.$el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

// API 請求
const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/product', {
      params: {
        search: search.value,
        category: category.value === '全部' ? '' : category.value,
        store: store.value,
      },
    })
    products.value = data.result
  } catch {
    createSnackbar({
      text: '無法取得商品列表',
      snackbarProps: { color: 'red-darken-2' },
    })
  } finally {
    loading.value = false
  }
}

// 搜尋防抖處理
let timer
const onSearchInput = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    fetchProducts()
  }, 500)
}

const onClearSearch = () => {
  search.value = ''
  fetchProducts()
}

onMounted(fetchProducts)
</script>

<style scoped>
/* 滿版輪播 */
.fullscreen-carousel {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  position: relative;
}

/* 文字內容層 */
.carousel-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* 雲朵容器 */
.cloud-wrapper {
  position: relative;
  display: inline-block;
  animation: cloudFloat 4s ease-in-out infinite;
  bottom: -150px;
}

/* 雲朵招牌樣式 - 長方形 */
.cloud-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(240, 248, 255, 0.92) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 22px 45px;
  position: relative;
  text-align: center;

  /* 更長的長方形 */
  border-radius: 45px;
  border: 3px solid rgba(173, 216, 230, 0.6);
  min-width: 280px;

  box-shadow:
    0 8px 32px rgba(93, 173, 226, 0.25),
    0 0 40px rgba(173, 216, 230, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.8);
}

/* 左邊的吊繩 */
.cloud-card::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg,
    rgba(93, 173, 226, 0.4),
    rgba(93, 173, 226, 0.6));
  top: -20px;
  left: 25%;
  border-radius: 2px;
}

/* 右邊的吊繩 */
.cloud-card::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(180deg,
    rgba(93, 173, 226, 0.4),
    rgba(93, 173, 226, 0.6));
  top: -20px;
  right: 25%;
  border-radius: 2px;
}

/* 左邊吊環 */
.cloud-wrapper::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid rgba(93, 173, 226, 0.5);
  border-radius: 50%;
  top: -22px;
  left: calc(25% - 3px);
  box-shadow: 0 2px 8px rgba(93, 173, 226, 0.3);
}

/* 右邊吊環 */
.cloud-wrapper::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: transparent;
  border: 2px solid rgba(93, 173, 226, 0.5);
  border-radius: 50%;
  top: -22px;
  right: calc(25% - 3px);
  box-shadow: 0 2px 8px rgba(93, 173, 226, 0.3);
}

/* 主標題樣式 */
.cloud-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2874A6;
  letter-spacing: 1px;
  margin-bottom: 6px;
  line-height: 1.2;
  position: relative;
  z-index: 2;
}

/* 副標題樣式 */
.cloud-subtitle {
  font-size: 0.85rem;
  font-weight: 500;
  color: #5499C7;
  letter-spacing: 0.5px;
  line-height: 1.4;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

/* 按鈕樣式 */
.explore-btn {
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
  position: relative;
  z-index: 2;
}

.explore-btn :deep(.v-icon) {
  font-size: 16px;
}

.explore-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(93, 173, 226, 0.4);
}

/* 雲朵招牌搖晃動畫 */
@keyframes cloudFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(-1deg);
  }
  75% {
    transform: translateY(-8px) rotate(1deg);
  }
}

/* 響應式 */
@media (max-width: 960px) {
  .cloud-card {
    padding: 20px 40px;
    border-radius: 40px;
    min-width: 240px;
  }

  .cloud-card::before,
  .cloud-card::after {
    height: 18px;
    top: -18px;
  }

  .cloud-wrapper::before,
  .cloud-wrapper::after {
    width: 9px;
    height: 9px;
    top: -20px;
  }

  .cloud-title {
    font-size: 1.1rem;
  }

  .cloud-subtitle {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .cloud-card {
    padding: 18px 35px;
    border-radius: 35px;
    min-width: 200px;
  }

  .cloud-card::before,
  .cloud-card::after {
    height: 15px;
    top: -15px;
  }

  .cloud-wrapper::before,
  .cloud-wrapper::after {
    width: 8px;
    height: 8px;
    top: -17px;
  }

  .cloud-title {
    font-size: 1rem;
  }

  .cloud-subtitle {
    font-size: 0.75rem;
  }

  .explore-btn {
    font-size: 0.8rem;
  }
}

/* 商品區域 */
.v-container {
  min-height: 100vh;
}

/* 虛線外框 */
.border-dashed-custom {
  border: 2px dashed #cfd8dc !important;
}

/* Chip 動畫 */
:deep(.v-chip) {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
  cursor: pointer;
}

:deep(.v-chip:hover) {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* 按鈕動畫 */
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
</style>
