<template>
  <v-container class="reviews-container" fluid>
    <v-row>
      <v-col cols="12">
        <!-- 標題卡片 -->
        <v-card class="header-card mb-6" elevation="8">
          <div class="header-content">
            <v-icon color="white" size="64">mdi-comment-text-multiple</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">評論管理</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">管理所有用戶的商品評論</p>
          </div>
        </v-card>

        <!-- 篩選與搜尋區 -->
        <v-card class="filter-card mb-4" elevation="2">
          <v-card-text class="pa-6">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  clearable
                  color="orange-darken-2"
                  density="comfortable"
                  hide-details
                  label="搜尋評論內容"
                  prepend-inner-icon="mdi-magnify"
                  rounded="lg"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterRating"
                  clearable
                  color="orange-darken-2"
                  density="comfortable"
                  hide-details
                  :items="ratingOptions"
                  label="評分篩選"
                  rounded="lg"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterStatus"
                  clearable
                  color="orange-darken-2"
                  density="comfortable"
                  hide-details
                  :items="statusOptions"
                  label="狀態篩選"
                  rounded="lg"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  block
                  color="orange-darken-2"
                  rounded="lg"
                  size="large"
                  @click="loadReviews"
                >
                  <v-icon class="mr-2" left>mdi-refresh</v-icon>
                  刷新
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 統計資訊 -->
        <v-row class="mb-4">
          <v-col cols="12" md="3" sm="6">
            <v-card class="stat-card" elevation="2">
              <v-card-text class="text-center pa-4">
                <v-icon color="blue" size="40">mdi-comment-text</v-icon>
                <div class="text-h4 font-weight-bold mt-2">{{ totalReviews }}</div>
                <div class="text-body-2 text-grey">總評論數</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card class="stat-card" elevation="2">
              <v-card-text class="text-center pa-4">
                <v-icon color="green" size="40">mdi-check-circle</v-icon>
                <div class="text-h4 font-weight-bold mt-2">{{ approvedReviews }}</div>
                <div class="text-body-2 text-grey">已審核</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card class="stat-card" elevation="2">
              <v-card-text class="text-center pa-4">
                <v-icon color="orange" size="40">mdi-clock-alert</v-icon>
                <div class="text-h4 font-weight-bold mt-2">{{ pendingReviews }}</div>
                <div class="text-body-2 text-grey">待審核</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <v-card class="stat-card" elevation="2">
              <v-card-text class="text-center pa-4">
                <v-icon color="amber" size="40">mdi-star</v-icon>
                <div class="text-h4 font-weight-bold mt-2">{{ averageRating }}</div>
                <div class="text-body-2 text-grey">平均評分</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- 評論列表 -->
        <v-card class="reviews-table-card" elevation="4">
          <v-card-title class="pa-6 bg-grey-lighten-4">
            <v-icon class="mr-2" color="orange-darken-2">mdi-format-list-bulleted</v-icon>
            <span class="font-weight-bold">評論列表</span>
          </v-card-title>

          <v-divider></v-divider>

          <v-data-table
            class="reviews-table"
            :headers="headers"
            :items="filteredReviews"
            :items-per-page="10"
            :loading="loading"
          >
            <!-- 用戶欄位 -->
            <template #item.user="{ item }">
              <div class="d-flex align-center">
                <v-avatar class="mr-2" size="32">
                  <v-img :src="`https://source.boringavatars.com/beam/120/${item.user}?colors=FF9800,F57C00,E65100,FFB74D,FFA726`"></v-img>
                </v-avatar>
                <span class="font-weight-medium">{{ item.user }}</span>
              </div>
            </template>

            <!-- 商品欄位 -->
            <template #item.product="{ item }">
              <div class="d-flex align-center">
                <v-img
                  class="rounded mr-2"
                  cover
                  height="50"
                  :src="item.productImage"
                  width="50"
                ></v-img>
                <div>
                  <div class="font-weight-medium">{{ item.product }}</div>
                  <div class="text-caption text-grey">{{ item.category }}</div>
                </div>
              </div>
            </template>

            <!-- 評分欄位 -->
            <template #item.rating="{ item }">
              <v-rating
                active-color="amber"
                color="amber"
                density="compact"
                half-increments
                :model-value="item.rating"
                readonly
                size="small"
              ></v-rating>
            </template>

            <!-- 評論內容 -->
            <template #item.comment="{ item }">
              <div class="comment-text">{{ item.comment }}</div>
            </template>

            <!-- 狀態欄位 -->
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                <v-icon size="small" start>{{ getStatusIcon(item.status) }}</v-icon>
                {{ item.status }}
              </v-chip>
            </template>

            <!-- 日期欄位 -->
            <template #item.createdAt="{ item }">
              <div class="text-body-2">{{ formatDate(item.createdAt) }}</div>
            </template>

            <!-- 操作欄位 -->
            <template #item.actions="{ item }">
              <div class="action-buttons">
                <v-btn
                  v-if="item.status === '待審核'"
                  color="green"
                  icon
                  size="small"
                  variant="text"
                  @click="approveReviewHandler(item)"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="top">審核通過</v-tooltip>
                </v-btn>
                <v-btn
                  color="blue"
                  icon
                  size="small"
                  variant="text"
                  @click="viewReview(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="top">查看詳情</v-tooltip>
                </v-btn>
                <v-btn
                  color="red"
                  icon
                  size="small"
                  variant="text"
                  @click="deleteReviewHandler(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent" location="top">刪除評論</v-tooltip>
                </v-btn>
              </div>
            </template>

            <!-- Loading -->
            <template #loading>
              <div class="text-center pa-8">
                <v-progress-circular
                  color="orange-darken-2"
                  indeterminate
                  size="64"
                ></v-progress-circular>
                <div class="mt-4 text-grey">載入中...</div>
              </div>
            </template>

            <!-- 無資料 -->
            <template #no-data>
              <div class="text-center pa-8">
                <v-icon color="grey-lighten-2" size="64">mdi-comment-off</v-icon>
                <div class="text-h6 text-grey mt-4">目前沒有評論資料</div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- 查看詳情對話框 -->
    <v-dialog v-model="viewDialog" max-width="600">
      <v-card v-if="selectedReview" class="detail-dialog">
        <div class="dialog-header">
          <h2 class="text-h5 font-weight-bold text-white">評論詳情</h2>
        </div>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12">
              <div class="detail-section">
                <div class="detail-label">用戶</div>
                <div class="d-flex align-center">
                  <v-avatar class="mr-3" size="40">
                    <v-img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${selectedReview.user}`"></v-img>
                  </v-avatar>
                  <span class="text-h6">{{ selectedReview.user }}</span>
                </div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="detail-section">
                <div class="detail-label">商品</div>
                <div class="d-flex align-center">
                  <v-img
                    class="rounded mr-3"
                    cover
                    height="60"
                    :src="selectedReview.productImage"
                    width="60"
                  ></v-img>
                  <div>
                    <div class="text-h6">{{ selectedReview.product }}</div>
                    <div class="text-body-2 text-grey">{{ selectedReview.category }}</div>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="detail-section">
                <div class="detail-label">評分</div>
                <v-rating
                  active-color="amber"
                  color="amber"
                  half-increments
                  :model-value="selectedReview.rating"
                  readonly
                  size="large"
                ></v-rating>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="detail-section">
                <div class="detail-label">評論內容</div>
                <div class="comment-detail">{{ selectedReview.comment }}</div>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="detail-section">
                <div class="detail-label">狀態</div>
                <v-chip
                  :color="getStatusColor(selectedReview.status)"
                  size="large"
                >
                  {{ selectedReview.status }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="6">
              <div class="detail-section">
                <div class="detail-label">發布時間</div>
                <div>{{ formatDate(selectedReview.createdAt) }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="viewDialog = false"
          >
            關閉
          </v-btn>
          <v-btn
            v-if="selectedReview.status === '待審核'"
            color="green"
            variant="flat"
            @click="approveReviewHandler(selectedReview)"
          >
            <v-icon class="mr-2" left>mdi-check</v-icon>
            審核通過
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 刪除確認對話框 -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 bg-red-lighten-5">
          <v-icon class="mr-2" color="red">mdi-alert-circle</v-icon>
          確認刪除
        </v-card-title>
        <v-card-text class="pa-6">
          確定要刪除這則評論嗎？此操作無法復原。
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            @click="confirmDelete"
          >
            確認刪除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceReview from '@/services/review'

const createSnackbar = useSnackbar()

// 篩選與搜尋
const search = ref('')
const filterRating = ref(null)
const filterStatus = ref(null)
const loading = ref(false)

// 對話框
const viewDialog = ref(false)
const deleteDialog = ref(false)
const selectedReview = ref(null)

// 評論資料
const reviews = ref([])

// 篩選選項
const ratingOptions = [
  { title: '5 星', value: 5 },
  { title: '4 星', value: 4 },
  { title: '3 星', value: 3 },
  { title: '2 星', value: 2 },
  { title: '1 星', value: 1 },
]

const statusOptions = [
  { title: '已審核', value: '已審核' },
  { title: '待審核', value: '待審核' },
  { title: '已隱藏', value: '已隱藏' },
]

// 表格標題
const headers = [
  { title: '用戶', key: 'user', sortable: true },
  { title: '商品', key: 'product', sortable: true },
  { title: '評分', key: 'rating', sortable: true },
  { title: '評論內容', key: 'comment', sortable: false },
  { title: '狀態', key: 'status', sortable: true },
  { title: '日期', key: 'createdAt', sortable: true },
  { title: '操作', key: 'actions', sortable: false, align: 'center' },
]

// 統計資料
const totalReviews = computed(() => reviews.value.length)
const approvedReviews = computed(() => reviews.value.filter(r => r.status === '已審核').length)
const pendingReviews = computed(() => reviews.value.filter(r => r.status === '待審核').length)
const averageRating = computed(() => {
  if (reviews.value.length === 0) return '0.0'
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

// 篩選後的評論
const filteredReviews = computed(() => {
  let result = reviews.value.map(r => ({
    ...r,
    user: r.user?.account || '未知用戶',
    product: r.product?.name || '未知商品',
    productImage: getImageUrl(r.product?.image),
    category: r.product?.category || '未分類',
  }))

  if (search.value) {
    result = result.filter(r =>
      r.comment.toLowerCase().includes(search.value.toLowerCase())
      || r.product.toLowerCase().includes(search.value.toLowerCase())
      || r.user.toLowerCase().includes(search.value.toLowerCase()),
    )
  }

  if (filterRating.value) {
    result = result.filter(r => Math.floor(r.rating) === filterRating.value)
  }

  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }

  return result
})

// 取得圖片網址
const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/100'
  if (image.startsWith('http')) return image
  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${image}`
}

// 載入評論
const loadReviews = async () => {
  loading.value = true
  try {
    const { data } = await serviceReview.getAllReviews()
    reviews.value = data.result
    createSnackbar({
      text: '評論資料已載入',
      snackbarProps: { color: 'green' },
    })
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: error?.response?.data?.message || '載入失敗',
      snackbarProps: { color: 'red' },
    })
  }
  loading.value = false
}

// 查看評論詳情
const viewReview = (review) => {
  selectedReview.value = review
  viewDialog.value = true
}

// 審核通過
const approveReviewHandler = async (review) => {
  try {
    await serviceReview.approveReview(review._id)
    viewDialog.value = false
    createSnackbar({
      text: '評論已審核通過',
      snackbarProps: { color: 'green' },
    })
    await loadReviews()
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: error?.response?.data?.message || '審核失敗',
      snackbarProps: { color: 'red' },
    })
  }
}

// 刪除評論
const deleteReviewHandler = (review) => {
  selectedReview.value = review
  deleteDialog.value = true
}

// 確認刪除
const confirmDelete = async () => {
  try {
    await serviceReview.deleteReview(selectedReview.value._id)
    createSnackbar({
      text: '評論已刪除',
      snackbarProps: { color: 'green' },
    })
    deleteDialog.value = false
    selectedReview.value = null
    await loadReviews()
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: error?.response?.data?.message || '刪除失敗',
      snackbarProps: { color: 'red' },
    })
  }
}

// 取得狀態顏色
const getStatusColor = (status) => {
  switch (status) {
  case '已審核': { return 'green'
  }
  case '待審核': { return 'orange'
  }
  case '已隱藏': { return 'grey'
  }
  default: { return 'grey'
  }
  }
}

// 取得狀態圖標
const getStatusIcon = (status) => {
  switch (status) {
  case '已審核': { return 'mdi-check-circle'
  }
  case '待審核': { return 'mdi-clock-alert'
  }
  case '已隱藏': { return 'mdi-eye-off'
  }
  default: { return 'mdi-help-circle'
  }
  }
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 頁面載入時取得評論
onMounted(() => {
  loadReviews()
})
</script>

<style scoped>
.reviews-container {
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

/* 篩選卡片 */
.filter-card {
  border-radius: 16px !important;
  border: 2px solid rgba(255, 152, 0, 0.1);
}

/* 統計卡片 */
.stat-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(255, 152, 0, 0.2);
}

/* 表格卡片 */
.reviews-table-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.reviews-table :deep(.v-data-table-header) {
  background: #F5F5F5;
  font-weight: 600;
}

.reviews-table :deep(tbody tr:hover) {
  background: rgba(255, 152, 0, 0.05) !important;
}

/* 評論文字 */
.comment-text {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 操作按鈕 */
.action-buttons {
  display: flex;
  gap: 4px;
}

/* 詳情對話框 */
.detail-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  padding: 24px;
  text-align: center;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-label {
  font-size: 0.875rem;
  color: #757575;
  margin-bottom: 8px;
  font-weight: 600;
}

.comment-detail {
  background: #F5F5F5;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #FF9800;
  line-height: 1.6;
}

/* 響應式 */
@media (max-width: 960px) {
  .reviews-container {
    padding: 20px 12px;
  }

  .header-content {
    padding: 32px 20px;
  }

  .header-content h1 {
    font-size: 2rem !important;
  }

  .comment-text {
    max-width: 200px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: "評論管理"
  login: login-only
  admin: true
</route>
