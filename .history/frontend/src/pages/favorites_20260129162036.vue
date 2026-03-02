<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center font-weight-bold text-blue-grey-darken-3 brand-font">❤️ 我的收藏清單</h1>
        <div class="text-center text-blue-grey-lighten-1 brand-font mt-2">那些想吃、必吃、還沒吃的都在這裡</div>
      </v-col>

      <v-divider class="my-6"></v-divider>

      <v-col cols="12">
        <div v-if="cart.length === 0" class="text-center my-15 py-10 rounded-xl border-dashed-custom bg-white">
          <v-icon class="mb-4" color="blue-grey-lighten-4" icon="mdi-heart-broken" size="80"></v-icon>
          <h3 class="text-blue-grey-darken-2 brand-font text-h5">您還沒有收藏任何商品喔</h3>
          <p class="text-grey mb-6 brand-font">快去首頁看看有沒有喜歡的日本好物吧！</p>
          <v-btn
            class="mt-4 brand-font px-8"
            color="blue-grey-darken-3"
            rounded="pill"
            size="large"
            to="/"
            variant="flat"
          >
            去首頁逛逛
          </v-btn>
        </div>

        <v-list v-else class="bg-transparent" lines="three">
          <v-list-item
            v-for="(item, i) in cart"
            :key="item._id"
            class="mb-4 rounded-xl elevation-1 bg-white pa-4 product-item"
            @click="$router.push('/product/' + item.product._id)"
          >
            <template #prepend>
              <v-avatar class="me-4 rounded-lg" size="100">
                <v-img class="bg-grey-lighten-3" cover :src="item.product.imageUrl"></v-img>
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 font-weight-bold mb-1 brand-font text-blue-grey-darken-3">
              {{ item.product.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="d-flex align-center mt-2 flex-wrap ga-2">
              <span class="text-deep-orange-darken-2 text-h6 font-weight-bold me-3 brand-font">
                ¥{{ item.product.price }}
              </span>

              <v-chip
                v-if="item.product.store"
                class="brand-font font-weight-bold"
                :color="getStoreColor(item.product.store)"
                label
                size="small"
                style="color: white !important;"
                variant="flat"
              >
                {{ item.product.store }}
              </v-chip>

              <div class="d-flex align-center">
                <v-rating
                  color="amber-darken-2"
                  density="compact"
                  half-increments
                  :model-value="item.product.rating || 0"
                  readonly
                  size="small"
                ></v-rating>
                <span class="text-caption text-grey ms-1 brand-font">
                  ({{ item.product.rating || 0 }})
                </span>
              </div>
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-center justify-center h-100">
                <v-tooltip location="top" text="取消收藏">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red-lighten-2"
                      icon="mdi-delete-outline"
                      variant="text"
                      @click.stop="deleteItem(item, i)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const user = useUserStore()

const cart = ref([])

// 超商顏色輔助函式
const getStoreColor = (storeName) => {
  switch (storeName) {
  case '7-11': { return '#F58220'
  }
  case '全家': { return '#009944'
  }
  case 'Lawson': { return '#006CB7'
  }
  default: { return 'grey'
  }
  }
}

// 讀取購物車
const getCart = async () => {
  try {
    const { data } = await serviceUser.getCart()
    cart.value = data.result
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: '取得收藏清單失敗',
      snackbarProps: { color: 'red-darken-2' },
    })
  }
}

// 刪除邏輯
const deleteItem = async (item, i) => {
  try {
    const { data } = await serviceUser.cart({
      product: item.product._id,
      quantity: 0, // 0 代表刪除
    })

    // 更新 Pinia 狀態
    user.cart = data.result

    // 從畫面移除
    cart.value.splice(i, 1)

    createSnackbar({
      text: '已取消收藏',
      snackbarProps: { color: 'green-darken-2' },
    })
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: '刪除失敗，請稍後再試',
      snackbarProps: { color: 'red-darken-2' },
    })
  }
}

onMounted(() => {
  getCart()
})
</script>

<style scoped>
/* 字體設定 */
.brand-font {
  font-family: 'Zen Maru Gothic', sans-serif !important;
}

/* 虛線邊框 (空狀態用) */
.border-dashed-custom {
  border: 2px dashed #cfd8dc !important;
}

/* 列表項目懸停效果 */
.product-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
</style>

<route lang="yaml">
meta:
  title: "私藏清單 — My Favorites"
  login: login-only
</route>
