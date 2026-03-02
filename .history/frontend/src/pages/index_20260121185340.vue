<template>
  <v-container class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-brown-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          精選商品
        </h1>
        <p class="text-grey mt-2">探索我們為您精心挑選的日本好物</p>

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

          :id="product._id"

          :category="product.category"

          :description="product.description"

          :image-url="product.image"

          :name="product.name"

          :price="product.price"

          :rating="product.rating || 0"

          :review-count="product.reviewCount || 0"
        />

      </v-col>

    </v-row>

  </v-container>

</template>

<script setup>

import { onMounted, ref } from 'vue'

import { useSnackbar } from 'vuetify-use-dialog'

// 記得引入你剛剛寫好的卡片元件

import ProductCard from '@/components/CardProduct.vue'

import { api } from '@/plugins/axios'

const createSnackbar = useSnackbar()

// 商品列表資料

const products = ref([])

const loading = ref(true)

const fetchProducts = async () => {
  loading.value = true

  try {
    // 假設你的 API 路徑是 /product (取得所有上架商品)

    const { data } = await api.get('/product')

    // 將結果存入變數

    products.value = data.result
  } catch (error) {
    createSnackbar({

      text: '無法取得商品列表，請稍後再試',

      snackbarProps: { color: 'red' },

    })

    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

</script>

<style scoped>

.border-dashed {

  border: 2px dashed #D7CCC8;

}

</style>
