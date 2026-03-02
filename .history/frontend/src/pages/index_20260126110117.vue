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
        <h1 class="text-h4 font-weight-bold text-brown-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          精選商品
        </h1>
        <p class="text-grey-darken-1 mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          clearable
          color="brown-darken-2"
          bg-color="white"
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          class="rounded-lg shadow-sm"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="brown-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip filter value="全部" variant="outlined">全部</v-chip>
          <v-chip
            v-for="c in ['甜點', '零食', '熟食', '冰品', '泡麵']"
            :key="c"
            filter
            :value="c"
            variant="outlined"
          >{{ c }}</v-chip>
        </v-chip-group>
        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>
        <v-chip-group v-model="store" color="blue-darken-2" @update:model-value="fetchProducts">
          <v-chip
            v-for="s in ['7-11', '全家', 'Lawson']"
            :key="s"
            filter
            :value="s"
            variant="outlined"
          >{{ s }}</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="loading" cols="12">
        <div class="text-center py-10">
          <v-progress-circular color="brown-lighten-2" indeterminate size="64"></v-progress-circular>
          <div class="text-grey mt-4">正在搬運商品中...</div>
        </div>
      </v-col>
      <v-col v-else-if="products.length === 0" cols="12">
        <div class="text-center text-grey py-10 bg-white rounded-xl border-dashed">
          <v-icon class="mb-2" size="64">mdi-package-variant-closed</v-icon>
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

// 自動計算高度
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
    createSnackbar({ text: '無法取得商品列表', snackbarProps: { color: 'red' } })
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
/* ★ 修改點：網頁大背景改為溫暖奶油色 ★ */
.v-container {
  background-color: #FFF9F0 !important;
  min-height: 100vh;
  /* 讓背景色延伸到兩側邊緣 */
  max-width: 100% !important;
}

/* 讓整體的卡片區域與背景更融合 */
:deep(.v-row) {
  margin: 0;
}
</style>
