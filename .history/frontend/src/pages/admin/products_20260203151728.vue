<template>
  <v-container class="products-container" fluid>
    <v-row>
      <v-col cols="12">
        <!-- 標題卡片 -->
        <v-card class="header-card mb-6" elevation="8">
          <div class="header-content">
            <v-icon size="64" color="white">mdi-food</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">商品管理</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">管理所有超商商品資訊</p>
          </div>
        </v-card>

        <!-- 商品列表 -->
        <v-card class="products-table-card" elevation="4">
          <v-card-title class="pa-6 bg-grey-lighten-4">
            <v-row align="center">
              <v-col cols="12" md="6">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="orange-darken-2">mdi-format-list-bulleted</v-icon>
                  <span class="font-weight-bold">商品列表</span>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="text-md-right">
                <v-text-field
                  v-model="search"
                  variant="outlined"
                  color="orange-darken-2"
                  density="compact"
                  hide-details
                  placeholder="搜尋商品..."
                  prepend-inner-icon="mdi-magnify"
                  style="max-width: 400px; display: inline-flex;"
                  rounded="lg"
                  class="mr-2"
                />
                <v-btn
                  color="orange-darken-2"
                  elevation="2"
                  rounded="lg"
                  @click="openDialog(null)"
                >
                  <v-icon left class="mr-2">mdi-plus</v-icon>
                  新增商品
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>

          <v-divider></v-divider>

          <v-data-table
            class="products-table"
            :filter-keys="['name', 'category', 'store', 'description', '_id', 'price', 'createdAt', 'updatedAt']"
            :headers="headers"
            hover
            :items="products"
            :search="search"
            :items-per-page="10"
          >
            <template #[`item.imageUrl`]="{ value }">
              <v-avatar class="ma-2" rounded="lg" size="60">
                <v-img cover :src="value" />
              </v-avatar>
            </template>

            <template #[`item.store`]="{ item }">
              <v-chip
                class="font-weight-bold"
                :color="item.storeColor"
                size="small"
                variant="flat"
              >
                {{ item.store }}
              </v-chip>
            </template>

            <template #[`item.sell`]="{ value }">
              <v-chip
                :color="value ? 'green' : 'grey'"
                size="small"
                variant="flat"
              >
                <v-icon :icon="value ? 'mdi-check' : 'mdi-close'" start size="small" />
                {{ value ? '上架中' : '未上架' }}
              </v-chip>
            </template>

            <template #[`item.action`]="{ item }">
              <v-btn
                icon
                size="small"
                color="orange-darken-2"
                variant="text"
                @click="openDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">編輯</v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- 編輯對話框 -->
  <v-dialog v-model="dialog.open" max-width="600" persistent scrollable>
    <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
      <v-card class="dialog-card">
        <!-- 對話框標題 -->
        <div class="dialog-header">
          <v-icon size="48" color="white">{{ dialog.id ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
          <h2 class="text-h5 font-weight-bold text-white mt-3">
            {{ dialog.id ? '編輯商品' : '新增商品' }}
          </h2>
        </div>

        <v-card-text class="pa-6" style="max-height: 60vh; overflow-y: auto;">
          <v-text-field
            v-model="name.value.value"
            variant="outlined"
            color="orange-darken-2"
            density="comfortable"
            :error-messages="name.errorMessage.value"
            label="商品名稱"
            rounded="lg"
            class="mb-2"
          />

          <v-text-field
            v-model="price.value.value"
            variant="outlined"
            color="orange-darken-2"
            density="comfortable"
            :error-messages="price.errorMessage.value"
            label="商品價格 (JPY)"
            prefix="¥"
            type="number"
            rounded="lg"
            class="mb-2"
          />

          <v-select
            v-model="store.value.value"
            variant="outlined"
            color="orange-darken-2"
            density="comfortable"
            :error-messages="store.errorMessage.value"
            :items="storeOptions"
            label="販售超商"
            rounded="lg"
            class="mb-2"
          />

          <v-select
            v-model="category.value.value"
            variant="outlined"
            color="orange-darken-2"
            density="comfortable"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="商品分類"
            rounded="lg"
            class="mb-2"
          />

          <v-textarea
            v-model="description.value.value"
            variant="outlined"
            color="orange-darken-2"
            counter="1000"
            density="comfortable"
            :error-messages="description.errorMessage.value"
            label="商品說明"
            rows="3"
            rounded="lg"
            class="mb-2"
          />

          <div class="mb-4 pa-4 bg-orange-lighten-5 rounded-lg">
            <p class="text-subtitle-2 font-weight-bold mb-2 text-orange-darken-2">商品圖片</p>
            <vue-file-agent
              ref="fileAgent"
              v-model="fileRecords"
              v-model:raw-model-value="rawFileRecords"
              accept="image/png,image/jpg,image/jpeg"
              deletable
              :max-files="1"
              max-size="1MB"
            />
          </div>

          <v-checkbox
            v-model="sell.value.value"
            color="orange-darken-2"
            density="comfortable"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="立即上架"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
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
            color="orange-darken-2"
            :loading="form.isSubmitting.value"
            type="submit"
            variant="flat"
            rounded="lg"
          >
            <v-icon left class="mr-2">{{ dialog.id ? 'mdi-content-save' : 'mdi-check' }}</v-icon>
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
.products-container {
  padding: 32px 24px;
  min-height: 100vh;
}

/* 標題卡片 */
.header-card {
  border-radius: 24px !important;
  overflow: hidden;
}

.header-content {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%);
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
}

/* 表格卡片 */
.products-table-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.products-table :deep(.v-data-table-header) {
  background: #F5F5F5;
  font-weight: 600;
}

.products-table :deep(tbody tr:hover) {
  background: rgba(255, 152, 0, 0.05) !important;
}

/* 對話框 */
.dialog-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  padding: 32px;
  text-align: center;
}

/* 響應式 */
@media (max-width: 960px) {
  .products-container {
    padding: 20px 12px;
  }

  .header-content {
    padding: 32px 20px;
  }

  .header-content h1 {
    font-size: 2rem !important;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: "商品管理"
  admin: true
</route>
