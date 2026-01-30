<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">訂單</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="orders">
          <template #[`item.cart`]="{ value }">
            <ul>
              <li v-for="item in value" :key="item._id">
                {{ item.product.name }} x {{ item.quantity }}
              </li>
            </ul>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceOrder from '@/services/order'

const createSnackbar = useSnackbar()
const orders = ref([])

const headers = [
  { title: 'ID', key: '_id' },
  { title: '訂購日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
  { title: '商品', key: 'cart', sortable: false },
  {
    title: '總金額',
    key: 'totalPrice',
    value: item => item.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0),
  },
]

const getOrders = async () => {
  try {
    const { data } = await serviceOrder.get()
    orders.value = data.result
  } catch {
    createSnackbar({
      text: '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}
getOrders()
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 訂單
  login: login-only
  admin: true
</route>
