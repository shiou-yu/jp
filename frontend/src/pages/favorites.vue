<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center font-weight-bold text-grey">❤️ 我的收藏清單</h1>
        <div class="text-center text-grey">那些想吃、必吃、還沒吃的都在這裡</div>
      </v-col>

      <v-divider class="my-4"></v-divider>

      <v-col cols="12">
        <div v-if="cart.length === 0" class="text-center my-10 text-grey">
          <v-icon class="mb-3" icon="mdi-heart-broken" size="64"></v-icon>
          <h3>您還沒有收藏任何商品喔</h3>
          <v-btn class="mt-4" color="primary" to="/" variant="tonal">去首頁逛逛</v-btn>
        </div>

        <v-list v-else class="bg-transparent" lines="three">
          <v-list-item
            v-for="(item, i) in validCart"
            :key="item._id"
            class="mb-3 rounded-lg elevation-2 bg-white pa-4"
            @click="$router.push('/product/' + item.product._id)"
          >
            <template #prepend>
              <v-avatar class="me-4" rounded="lg" size="100">
                <v-img class="bg-grey-lighten-2" cover :src="item.product.imageUrl"></v-img>
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 font-weight-bold mb-1">
              {{ item.product.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="d-flex align-center mt-1">
              <span class="text-primary text-subtitle-1 font-weight-bold me-3">
                ¥{{ item.product.price }}
              </span>
              <v-chip
                v-if="item.product.store"
                class="me-2"
                :color="getStoreColor(item.product.store)"
                label
                size="x-small"
                text-color="white"
              >
                {{ item.product.store }}
              </v-chip>
            </v-list-item-subtitle>

            <div class="mt-2 d-flex align-center">
              <v-rating
                color="amber"
                density="compact"
                half-increments
                :model-value="item.product.rating || 0"
                readonly
                size="small"
              ></v-rating>
              <span class="text-caption text-grey ms-2">
                ({{ item.product.rating || 0 }}分)
              </span>
            </div>

            <template #append>
              <div class="d-flex flex-column align-center">
                <v-tooltip location="top" text="取消收藏">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red-lighten-1"
                      icon="mdi-delete-outline"
                      size="large"
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
import { computed, onMounted, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const user = useUserStore()

const cart = ref([])

// 過濾掉 product 為 null 的項目
const validCart = computed(() => {
  return cart.value.filter(item => item && item.product)
})

// 輔助函式：取得超商顏色 (雖然卡片也有寫，但這裡是列表頁，手動配一下顏色比較保險)
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

const getCart = async () => {
  try {
    console.log('🔍 開始獲取收藏清單...')
    const { data } = await serviceUser.getCart()
    console.log('📦 後端返回的收藏:', data.result)
    cart.value = data.result || []
    console.log('✅ 本地 cart.value 長度:', cart.value.length)
    // 同步更新 Pinia 的數量
    user.cart = cart.value.length
    console.log('✅ 更新後 user.cart:', user.cart)
  } catch (error) {
    console.error('❌ 取得收藏清單失敗:', error)
    createSnackbar({
      text: '取得收藏清單失敗',
      snackbarProps: { color: 'red' },
    })
  }
}

// 組件掛載時才獲取數據
onMounted(() => {
  getCart()
})

// 刪除邏輯
const deleteItem = async (item, i) => {
  try {
    console.log('🗑️ 刪除商品:', item.product._id)
    // 傳送 quantity: 0 和 replace: true 給後端，代表刪除
    const { data } = await serviceUser.cart({
      product: item.product._id,
      quantity: 0,
      replace: true, // 關鍵：替換數量而不是增加
    })
    console.log('📡 後端返回的新數量:', data.result)

    // 從畫面陣列移除
    const actualIndex = cart.value.findIndex(cartItem => cartItem._id === item._id)
    if (actualIndex !== -1) {
      cart.value.splice(actualIndex, 1)
      console.log('✅ 從陣列移除，剩餘:', cart.value.length)
    }

    // 更新 Pinia 狀態（使用後端返回的數量）
    user.cart = data.result
    console.log('✅ 更新 user.cart 為:', user.cart)

    createSnackbar({
      text: '已取消收藏',
      snackbarProps: { color: 'success' },
    })
  } catch (error) {
    console.error('❌ 刪除失敗:', error)
    createSnackbar({
      text: '刪除失敗，請稍後再試',
      snackbarProps: { color: 'red' },
    })
    // 失敗時重新獲取列表
    await getCart()
  }
}
</script>

<route lang="yaml">
meta:
  title: "私藏清單 — My Favorites"
  login: login-only
</route>
