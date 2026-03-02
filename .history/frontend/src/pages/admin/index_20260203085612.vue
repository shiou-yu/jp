<template>
  <v-container class="admin-home-container" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="10" lg="8">
        <!-- 歡迎卡片 -->
        <v-card class="welcome-card" elevation="8">
          <div class="welcome-header">
            <v-icon size="80" color="white">mdi-shield-crown</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">管理中心</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">超商美食評論後台管理系統</p>
          </div>

          <v-card-text class="pa-8">
            <p class="text-h6 text-center text-grey-darken-2 mb-8">
              請選擇左側選單開始管理商品與訂單
            </p>

            <!-- 快捷功能卡片 -->
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                  to="/admin/products"
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon size="48" color="orange-darken-2">mdi-food</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">商品管理</h3>
                    <p class="text-body-2 text-grey">新增、編輯、刪除商品資訊</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                  to="/admin/orders"
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon size="48" color="blue-darken-2">mdi-clipboard-list</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">訂單管理</h3>
                    <p class="text-body-2 text-grey">查看與處理所有訂單</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon size="48" color="green-darken-2">mdi-chart-line</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">數據統計</h3>
                    <p class="text-body-2 text-grey">查看銷售與評論數據</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 快捷操作按鈕 -->
            <v-row class="mt-6">
              <v-col cols="12" class="text-center">
                <v-btn
                  size="large"
                  color="orange-darken-2"
                  class="mr-3 rounded-btn"
                  rounded="lg"
                  to="/admin/products"
                >
                  <v-icon left class="mr-2">mdi-plus-circle</v-icon>
                  新增商品
                </v-btn>
                <v-btn
                  size="large"
                  color="blue-darken-2"
                  class="rounded-btn"
                  rounded="lg"
                  variant="outlined"
                  to="/admin/orders"
                >
                  <v-icon left class="mr-2">mdi-format-list-checks</v-icon>
                  查看訂單
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 提示資訊 -->
        <v-alert
          class="mt-6"
          color="blue-grey-lighten-5"
          variant="tonal"
          border="start"
          border-color="orange-darken-2"
        >
          <template #prepend>
            <v-icon color="orange-darken-2">mdi-information</v-icon>
          </template>
          <div class="text-body-2">
            <strong>提示：</strong> 點擊左側選單或上方快捷卡片即可快速進入對應管理頁面
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.admin-home-container {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCCBC 100%);
  padding: 40px 16px;
}

.welcome-card {
  border-radius: 24px !important;
  overflow: hidden;
}

/* 漸層標題區 */
.welcome-header {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%);
  padding: 60px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
}

/* 功能卡片 */
.feature-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 152, 0, 0.1);
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(255, 152, 0, 0.3);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%);
}

/* 圓角按鈕 */
.rounded-btn {
  text-transform: none;
  letter-spacing: 1px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.rounded-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
}

/* 響應式調整 */
@media (max-width: 960px) {
  .welcome-header {
    padding: 40px 24px;
  }

  .welcome-header h1 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .admin-home-container {
    padding: 20px 12px;
  }

  .welcome-card :deep(.v-card-text) {
    padding: 24px 16px !important;
  }

  .rounded-btn {
    display: block;
    width: 100%;
    margin: 8px 0 !important;
  }
}
</style>

<route lang="yaml">
meta:
  layout: admin
  title: "後台管理"
  login: login-only
  admin: true
</route>
