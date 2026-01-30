<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center my-4" style="color: #607D8B; font-weight: bold; letter-spacing: 2px;">
          <v-icon class="mr-2" icon="mdi-store-outline" />日本超商商品管理
        </h1>
      </v-col>
      <v-divider class="mb-6"></v-divider>

      <v-col cols="12">
        <v-data-table
          class="elevation-1 rounded-lg"
          :filter-keys="['name', 'category', 'store', 'description', '_id', 'price', 'createdAt', 'updatedAt']"
          :headers="headers"
          hover
          :items="products"
          :search="search"
        >
          <template #top>
            <v-toolbar class="px-4 border-b" color="white" flat>
              <v-text-field
                v-model="search"
                color="teal-lighten-1"
                density="compact"
                flat
                hide-details
                placeholder="搜尋商品..."
                prepend-inner-icon="mdi-magnify"
                style="max-width: 300px;"
                variant="outlined"
              />
              <v-spacer />
              <v-btn
                class="text-white"
                color="#26A69A"
                elevation="1"
                prepend-icon="mdi-plus"
                variant="flat"
                @click="openDialog(null)"
              >
                新增商品
              </v-btn>
            </v-toolbar>
          </template>

          <template #[`item.imageUrl`]="{ value }">
            <v-avatar class="ma-2 border" rounded="lg" size="60">
              <v-img cover :src="value" />
            </v-avatar>
          </template>

          <template #[`item.store`]="{ item }">
            <v-chip
              class="font-weight-bold"
              :color="item.storeColor"
              label
              size="small"
              text-color="white"
              variant="flat"
            >
              {{ item.store }}
            </v-chip>
          </template>

          <template #[`item.sell`]="{ value }">
            <v-chip :color="value ? 'teal-lighten-2' : 'grey-lighten-1'" size="x-small" variant="tonal">
              <v-icon :icon="value ? 'mdi-check' : 'mdi-close'" start />
              {{ value ? '上架中' : '未上架' }}
            </v-chip>
          </template>

          <template #[`item.action`]="{ item }">
            <v-btn color="grey-darken-1" icon="mdi-pencil-outline" variant="text" @click="openDialog(item)" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog.open" persistent scrollable width="600">
    <v-form :disabled="form.isSubmitting.value" style="height: 100%;" @submit.prevent="submit">
      <v-card class="rounded-xl" style="max-height: 85vh; display: flex; flex-direction: column;">

        <v-card-title class="bg-grey-lighten-5 py-5 px-6 d-flex align-center flex-shrink-0 border-b">
          <v-icon class="mr-2" color="#607D8B" icon="mdi-playlist-edit" />
          <span class="font-weight-bold" style="color: #455A64">
            {{ dialog.id ? '編輯內容' : '新增商品' }}
          </span>
        </v-card-title>

        <v-card-text class="pt-6 flex-grow-1" style="overflow-y: auto;">
          <v-text-field
            v-model="name.value.value"
            color="teal"
            density="comfortable"
            :error-messages="name.errorMessage.value"
            label="商品名稱"
            variant="outlined"
          />

          <v-text-field
            v-model="price.value.value"
            color="teal"
            density="comfortable"
            :error-messages="price.errorMessage.value"
            label="商品價格 (JPY)"
            prefix="¥"
            type="number"
            variant="outlined"
          />

          <v-select
            v-model="store.value.value"
            color="teal"
            density="comfortable"
            :error-messages="store.errorMessage.value"
            :items="storeOptions"
            label="販售超商"
            variant="outlined"
          />

          <v-select
            v-model="category.value.value"
            color="teal"
            density="comfortable"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="商品分類"
            variant="outlined"
          />

          <v-textarea
            v-model="description.value.value"
            color="teal"
            counter="1000"
            density="comfortable"
            :error-messages="description.errorMessage.value"
            label="商品說明"
            rows="3"
            variant="outlined"
          />

          <div class="mb-4 pa-4 bg-grey-lighten-5 rounded">
            <p class="text-caption font-weight-bold mb-2 text-grey-darken-1">商品圖片</p>
            <vue-file-agent
              ref="fileAgent"
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/png,image/jpg,image/jpeg"
              :compact="false"
              deletable
              :max-files="1"
              max-size="1MB"
              theme="default"
            />
          </div>

          <v-checkbox
            v-model="sell.value.value"
            color="teal"
            density="compact"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="立即上架"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-white flex-shrink-0">
          <v-spacer />
          <v-btn
            color="grey"
            :disabled="form.isSubmitting.value"
            variant="text"
            @click="closeDialog"
          >
            取消
          </v-btn>
          <v-btn
            class="text-white px-8"
            color="#26A69A"
            :loading="form.isSubmitting.value"
            type="submit"
            variant="flat"
          >
            {{ dialog.id ? '儲存' : '確認' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { ref, useTemplateRef } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import serviceProduct from '@/services/product'

const createSnackbar = useSnackbar()

// ************************
// * 顯示商品        *
// ************************
const products = ref([])
const search = ref('')
const headers = [
  { title: '圖片', key: 'imageUrl', sortable: false, width: '100px' },
  { title: '名稱', key: 'name' },
  { title: '超商', key: 'store' },
  { title: '分類', key: 'category' },
  { title: '價格', key: 'price' },
  { title: '上架', key: 'sell' },
  { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleDateString() },
  { title: '操作', key: 'action', sortable: false },
]

const getProducts = async () => {
  try {
    const { data } = await serviceProduct.getAll()
    products.value = data.result
  } catch {
    createSnackbar({
      text: '讀取資料失敗',
      snackbarProps: { color: 'red' },
    })
  }
}
getProducts()

// ************************
// * 表單邏輯        *
// ************************
const fileAgent = useTemplateRef('fileAgent')
const dialog = ref({
  open: false,
  id: '',
})

const storeOptions = ['7-11', '全家', 'Lawson']
const categoryOptions = ['甜點', '零食', '熟食', '冰品', '泡麵']

const schema = yup.object({
  name: yup.string().required('請輸入商品名稱').min(1).max(100),
  price: yup.number().typeError('價格必須為數字').required('請輸入商品價格').min(0),
  description: yup.string().max(1000),
  store: yup.string().required('請選擇販售超商').oneOf(storeOptions, '超商名稱無效'),
  category: yup.string().required('請選擇商品分類').oneOf(categoryOptions, '分類名稱無效'),
  sell: yup.boolean().required('請選擇商品狀態'),
})

const form = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    price: 0,
    description: '',
    store: '',
    category: '',
    sell: false,
  },
})

const name = useField('name')
const price = useField('price')
const description = useField('description')
const store = useField('store')
const category = useField('category')
const sell = useField('sell')
const fileRecords = ref([])
const rawFileRecords = ref([])

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    name.value.value = item.name
    price.value.value = item.price
    description.value.value = item.description
    store.value.value = item.store
    category.value.value = item.category
    sell.value.value = item.sell
  }
  dialog.value.open = true
}

const closeDialog = () => {
  dialog.value.open = false
  dialog.value.id = ''
  form.resetForm()
  fileAgent.value?.deleteFileRecord()
}

const submit = form.handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) {
    createSnackbar({ text: '圖片檔案無效', snackbarProps: { color: 'red' } })
    return
  }
  if (!dialog.value.id && fileRecords.value.length === 0) {
    createSnackbar({ text: '請上傳商品圖片', snackbarProps: { color: 'red' } })
    return
  }

  try {
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('price', values.price)
    fd.append('description', values.description)
    fd.append('store', values.store)
    fd.append('category', values.category)
    fd.append('sell', values.sell)
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    await (dialog.value.id ? serviceProduct.update(dialog.value.id, fd) : serviceProduct.create(fd))

    createSnackbar({ text: '操作成功', snackbarProps: { color: 'green' } })
    closeDialog()
    await getProducts()
  } catch (error) {
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({ text, snackbarProps: { color: 'red' } })
  }
})
</script>

<style scoped>
/* 稍微增加一些間距，讓畫面更呼吸 */
.v-container {
  max-width: 1200px;
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: "商品資料維護"
  admin: true
</route>
