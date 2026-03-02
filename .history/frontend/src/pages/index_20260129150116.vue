<template>
  <v-app>
    <v-app-bar
      :class="['dynamic-navbar', { 'is-scrolled': isScrolled }]"
      fixed
      flat
    >
      <v-container class="d-flex align-center">
        <v-app-bar-title class="brand-font font-weight-bold">
          日本超商精選
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <div class="d-none d-md-flex">
          <v-btn class="nav-btn" to="/" variant="text">首頁</v-btn>
          <v-btn class="nav-btn" to="/products" variant="text">商品列表</v-btn>
        </div>
        <v-btn class="d-md-none" icon="mdi-menu"></v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="pa-0">
      <section class="hero-section">
        <v-carousel
          class="full-screen-carousel"
          cycle
          height="100vh"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            cover
            :src="slide.src"
          >
            <v-row align="center" class="fill-height ma-0" justify="center">
              <div class="carousel-overlay-content text-center">
                <h1 class="hero-title">日本超商精選</h1>
                <p class="hero-subtitle">Premium Selection from Japanese Convenience Stores</p>
                <v-btn
                  class="mt-6 hero-btn"
                  color="white"
                  size="large"
                  variant="outlined"
                  @click="scrollToContent"
                >
                  探索熱門商品
                </v-btn>
              </div>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </section>

      <v-container id="product-list" class="py-10">
        <v-row class="mb-6">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3 brand-font">
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
              <v-chip color="pink-lighten-4" filter value="甜點" variant="flat">甜點 🍰</v-chip>
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
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/CardProduct.vue'
import { api } from '@/plugins/axios'

// 狀態管理
const isScrolled = ref(false)
const products = ref([])
const loading = ref(true)
const search = ref('')
const category = ref('全部')
const store = ref(null)
const createSnackbar = useSnackbar()

const slides = ref([
  { src: '/banner-01.jpg' },
  { src: '/banner-02.jpg' },
  { src: '/banner-03.jpg' },
  { src: '/banner-04.png' },
  { src: '/banner-05.jpg' },
])

// 滾動監聽邏輯
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToContent = () => {
  document.querySelector('#product-list').scrollIntoView({ behavior: 'smooth' })
}

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

let timer
const onSearchInput = () => {
  clearTimeout(timer)
  timer = setTimeout(() => fetchProducts(), 500)
}

const onClearSearch = () => {
  search.value = ''
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* --- 導覽列動態樣式 --- */
.dynamic-navbar {
  background-color: transparent !important;
  transition: all 0.4s ease-in-out !important;
  color: white !important; /* 初始文字白色 */
}

.dynamic-navbar.is-scrolled {
  backdrop-filter: blur(12px) saturate(160%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  background-color: rgba(255, 255, 255, 0.7) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #37474f !important; /* 滾動後變深色文字 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

/* 修正 Vuetify 內層透明度 */
:deep(.v-toolbar__content) {
  background: transparent !important;
}

/* --- 滿版輪播與 Hero 樣式 --- */
.hero-section {
  width: 100%;
  height: 100vh;
  position: relative;
}

.carousel-overlay-content {
  color: white;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  padding: 0 20px;
  z-index: 2;
}

.hero-title {
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  letter-spacing: 0.2em;
  opacity: 0.9;
}

.hero-btn {
  border-width: 2px !important;
  font-family: 'Zen Maru Gothic', sans-serif !important;
  font-weight: 700;
}

/* --- 其他通用樣式 --- */
.brand-font, .nav-btn {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

.border-dashed-custom {
  border: 2px dashed #cfd8dc !important;
}

:deep(.v-chip) {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
}

:deep(.v-chip:hover) {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
