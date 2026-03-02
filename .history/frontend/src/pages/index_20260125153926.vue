<template>
  <v-container class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-carousel
          cycle
          height="400"
          hide-delimiter-background
          show-arrows="hover"
          class="rounded-xl shadow-lg"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            :src="slide.src"
            cover
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
        <p class="text-grey mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          clearable
          color="amber-darken-2"
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="amber-darken-3" mandatory @update:model-value="fetchProducts">
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
          <v-progress-circular color="amber" indeterminate size="64"></v-progress-circular>
          <div class="text-grey mt-4">正在搬運商品中...</div>
        </div>
      </v-col>
      <v-col v-else-if="products.length === 0" cols="12">
        <div class="text-center text-grey py-10 bg-amber-lighten-5 rounded-xl border-dashed">
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
import { onMounted, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/CardProduct.vue'
import { api } from '@/plugins/axios'

const createSnackbar = useSnackbar()
const products = ref([])
const loading = ref(true)

// ==========================================
// 新增區域：輪播圖資料
// 您可以將這裡的 src 換成您實際的圖片網址
// ==========================================
const slides = ref([
  { src: '/banner-01.jpg' }, // 日本美食示意圖 1
  { src: '/banner-02.jpg' }, // 日本美食示意圖 2
  { src: '/banner-03.jpg' }, // 日本美食示意圖 3
  { src: '/banner-04.p' }, // 日本美食示意圖 4
  { src: 'https://images.unsplash.com/photo-1554502078-ef0fc409efce?q=80&w=1920&auto=format&fit=crop' }, // 日本店鋪示意圖
  { src: 'https://images.unsplash.com/photo-1588611910609-0268f7b7f147?q=80&w=1920&auto=format&fit=crop' }, // 日本甜點示意圖
])
// ==========================================

// 篩選變數
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
