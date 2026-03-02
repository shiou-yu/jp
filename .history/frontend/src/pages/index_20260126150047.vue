<template>
  <v-container class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-carousel
          class="rounded-xl shadow-lg"
          cycle
          :height="carouselHeight"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            cover
            :src="slide.src"
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          精選商品
        </h1>
        <p class="text-blue-grey-darken-1 mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          bg-color="white"
          class="rounded-lg shadow-sm"
          clearable
          color="blue-grey-darken-3"
          flat
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
          @update:model-value="fetchProducts"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="blue-grey-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip
            filter value="全部" variant="flat"
            bg-color="grey-lighten-4"
            class="text-blue-grey-darken-3 font-weight-bold px-4 rounded-pill"
          >全部</v-chip>

          <v-chip filter value="甜點" variant="flat" bg-color="pink-lighten-5" class="text-pink-darken-2 font-weight-bold rounded-pill">甜點 🍰</v-chip>
          <v-chip filter value="零食" variant="flat" bg-color="orange-lighten-5" class="text-orange-darken-4 font-weight-bold rounded-pill">零食 🍪</v-chip>
          <v-chip filter value="熟食" variant="flat" bg-color="amber-lighten-5" class="text-brown-darken-2 font-weight-bold rounded-pill">熟食 🍱</v-chip>
          <v-chip filter value="冰品" variant="flat" bg-color="blue-lighten-5" class="text-blue-darken-4 font-weight-bold rounded-pill">冰品 🍦</v-chip>
          <v-chip filter value="泡麵" variant="flat" bg-color="red-lighten-5" class="text-red-darken-4 font-weight-bold rounded-pill">泡麵 🍜</v-chip>
        </v-chip-group>

        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>

        <v-chip-group v-model="store" @update:model-value="fetchProducts">
          <v-chip
            value="7-11" variant="flat"
            bg-color="blue-grey-lighten-5"
            selected-class="bg-deep-orange-darken-2 text-white"
            class="text-blue-grey-darken-3 font-weight-black rounded-lg px-5"
          >7-11</v-chip>

          <v-chip
            value="全家" variant="flat"
            bg-color="blue-grey-lighten-5"
            selected-class="bg-green-darken-2 text-white"
            class="text-blue-grey-darken-3 font-weight-black rounded-lg px-5"
          >全家</v-chip>

          <v-chip
            value="Lawson" variant="flat"
            bg-color="blue-grey-lighten-5"
            selected-class="bg-blue-darken-2 text-white"
            class="text-blue-grey-darken-3 font-weight-black rounded-lg px-5"
          >Lawson</v-chip>
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
        <div class="text-center text-grey py-10 bg-white rounded-xl border-dashed">
          <v-icon class="mb-2" color="blue-grey-lighten-3" size="64">mdi-package-variant-closed</v-icon>
          <h3>目前沒有商品上架</h3>
        </div>
      </v-col>
      <v-col
        v-for="product in products"
        v-else
        :key="product._id"
        cols="12"
        lg="4"
        md="6"
        xl="3"
      >
        <ProductCard
          :_id="product._id"
          :category="product.category"
          :description="product.description"
          :image="product.image"
          :name="product.name"
          :price="product.price"
          :review-count="product.reviewCount || 0"
        />
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

const carouselHeight = computed(() => {
  return mobile.value ? 300 : 400
})

const slides = ref([
  { src: '/banner-01.jpg' },
  { src: '/banner-02.jpg' },
  { src: '/banner-03.jpg' },
  { src: '/banner-04.png' },
  { src: '/banner-05.jpg' },
])

const search = ref('')
const category = ref('全部')
const store = ref(null)

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/product', {
      params: {
        search: search.value,
        category: category.value,
        store: store.value,
      },
    })
    products.value = data.result
  } catch {
    createSnackbar({
      text: '無法取得商品列表',
      snackbarProps: { color: 'blue-grey-darken-3' },
    })
  } finally {
    loading.value = false
  }
}

const onClearSearch = () => {
  search.value = ''
  fetchProducts()
}

onMounted(fetchProducts)
</script>

<style scoped>
.v-container {
  background-color: #FFF9F0 !important;
  min-height: 100vh;
  max-width: 100% !important;
}

:deep(.v-row) {
  margin: 0;
}

/* 種類標籤(圓形)選中後 */
:deep(.rounded-pill.v-chip--selected) {
  color: white !important;
}

/* 超商標籤(方形)懸停小動畫 */
:deep(.v-chip) {
  transition: all 0.2s ease-in-out !important;
}
:deep(.v-chip:hover) {
  transform: translateY(-3px) scale(1.05) !important;
}
</style>


