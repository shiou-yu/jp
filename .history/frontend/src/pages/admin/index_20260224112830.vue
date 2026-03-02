<template>
  <v-container class="admin-home-container" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" lg="8" md="10">
        <!-- 歡迎卡片 -->
        <v-card class="welcome-card" elevation="8">
          <div class="welcome-header">
            <v-icon color="white" size="80">mdi-shield-crown</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">管理中心</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">超商美食評論後台管理系統</p>
          </div>

          <v-card-text class="pa-8">
            <p class="text-h6 text-center text-brown-darken-2 mb-8">
              請選擇左側選單開始管理商品與評論
            </p>

            <!-- 快捷功能卡片 -->
            <v-row>
              <v-col cols="12" md="4" sm="6">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                  to="/admin/products"
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon color="brown-darken-1" size="48">mdi-food</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2 text-brown-darken-2">商品管理</h3>
                    <p class="text-body-2 text-brown-lighten-1">新增、編輯、刪除商品資訊</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                  to="/admin/reviews"
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon color="teal-darken-1" size="48">mdi-comment-text-multiple</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2 text-brown-darken-2">評論管理</h3>
                    <p class="text-body-2 text-brown-lighten-1">審核與管理用戶評論</p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4" sm="6">
                <v-card
                  class="feature-card"
                  elevation="2"
                  hover
                  to="/"
                >
                  <v-card-text class="text-center pa-6">
                    <div class="feature-icon-wrapper mb-4">
                      <v-icon color="blue-grey-darken-1" size="48">mdi-home</v-icon>
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2 text-brown-darken-2">回首頁</h3>
                    <p class="text-body-2 text-brown-lighten-1">返回網站前台首頁</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- 快捷操作按鈕 -->
            <v-row class="mt-6">
              <v-col class="text-center" cols="12">
                <v-btn
                  class="mr-3 rounded-btn"
                  color="brown-darken-1"
                  rounded="lg"
                  size="large"
                  to="/admin/products"
                >
                  <v-icon class="mr-2" left>mdi-plus-circle</v-icon>
                  新增商品
                </v-btn>
                <v-btn
                  class="rounded-btn"
                  color="brown-darken-1"
                  rounded="lg"
                  size="large"
                  to="/admin/reviews"
                  variant="outlined"
                >
                  <v-icon class="mr-2" left>mdi-comment-check</v-icon>
                  審核評論
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- 提示資訊 -->
        <v-alert
          border="start"
          border-color="brown-lighten-1"
          class="mt-6"
          color="brown-lighten-5"
          variant="tonal"
        >
          <template #prepend>
            <v-icon color="brown-darken-1">mdi-information</v-icon>
          </template>
          <div class="text-body-2 text-brown-darken-1">
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
  background: #FFF9E6;
  padding: 40px 16px;
}

.welcome-card {
  border-radius: 24px !important;
  overflow: hidden;
  background-color: #FFF9E6 !important;
}

/* 漸層標題區 */
.welcome-header {
  background: linear-gradient(135deg, #D7B896 0%, #C4956A 50%, #A0714F 100%);
  padding: 32px 32px;  /* 從 60px 改成 32px */
  text-align: center;
  box-shadow: 0 4px 20px rgba(160, 113, 79, 0.3);
}

/* 功能卡片 */
.feature-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  border: 2px solid rgba(196, 149, 106, 0.15);
  height: 100%;
  background-color: #F5E6D0 !important;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
  border-color: rgba(196, 149, 106, 0.4);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF9E6 0%, #F5E6C8 100%);
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
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
