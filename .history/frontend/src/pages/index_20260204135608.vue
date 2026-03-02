<template>
  <!-- 滿版輪播區 -->
  <v-carousel
    class="fullscreen-carousel"
    cycle
    height="100vh"
    hide-delimiters
    :interval="4000"
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
      cover
      :src="slide.src"
    >
      <!-- 文字覆蓋層（移到右下角）-->
      <v-container class="carousel-content fill-height">
        <v-row align="end" class="pb-8 pr-6" justify="end">
          <v-col cols="12" lg="4" md="5" sm="8">
            <!-- 雲朵文字卡片 -->
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
                color="#2C3E50"
                rounded="pill"
                size="small"
                variant="flat"
                @click="scrollToProducts"
              >
                <v-icon class="mr-1" size="small">mdi-compass</v-icon>
                立即探索
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-carousel-item>
  </v-carousel>

  <!-- 商品區域（保持不變）... -->
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

/* 雲朵卡片 */
.cloud-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 24px 28px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 0 60px rgba(255, 255, 255, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.8);
  animation: cloudFloat 3s ease-in-out infinite, slideInRight 1s ease-out;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.6);
}

/* 雲朵輪廓增強 */
.cloud-card::before {
  content: '';
  position: absolute;
  top: -15px;
  left: 20%;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  border-radius: 50%;
  box-shadow:
    60px 0 0 rgba(255, 255, 255, 0.9),
    30px -10px 0 rgba(255, 255, 255, 0.85);
}

.cloud-card::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 15%;
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 45px 0 0 rgba(255, 255, 255, 0.85);
}

/* 主標題樣式 */
.cloud-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2C3E50;
  letter-spacing: 1px;
  margin-bottom: 8px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* 副標題樣式 */
.cloud-subtitle {
  font-size: 0.95rem;
  font-weight: 500;
  color: #546E7A;
  letter-spacing: 0.5px;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* 按鈕樣式 */
.explore-btn {
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.3);
}

/* 雲朵漂浮動畫 */
@keyframes cloudFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 滑入動畫 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 響應式 */
@media (max-width: 960px) {
  .cloud-card {
    padding: 20px 24px;
    margin: 0 16px;
  }

  .cloud-title {
    font-size: 1.2rem;
  }

  .cloud-subtitle {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .cloud-card {
    padding: 18px 20px;
  }

  .cloud-title {
    font-size: 1.1rem;
  }

  .cloud-subtitle {
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
