<template>
  <v-container class="avatar-selector-container">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="avatar-card" elevation="8">
          <!-- 標題區 -->
          <div class="avatar-header">
            <v-icon size="64" color="white">mdi-account-circle</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">選擇你的頭像</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">挑選一個喜歡的表情代表你</p>
          </div>

          <v-card-text class="pa-8">
            <!-- 當前頭像預覽 -->
            <div class="current-avatar-section mb-6">
              <p class="text-h6 text-center mb-4">目前使用的頭像</p>
              <div class="text-center">
                <v-avatar size="120" class="current-avatar">
                  <v-img :src="`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.account}-${selectedAvatar}`"></v-img>
                </v-avatar>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- 頭像選擇網格 -->
            <p class="text-h6 text-center mb-4">選擇新頭像</p>
            <v-row>
              <v-col
                v-for="i in 10"
                :key="i"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  class="avatar-option"
                  :class="{ 'selected': selectedAvatar === i }"
                  elevation="2"
                  @click="selectAvatar(i)"
                >
                  <v-img
                    :src="`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${user.account}-${i}`"
                    aspect-ratio="1"
                  ></v-img>
                  <div class="avatar-number">{{ i }}</div>
                  <div v-if="selectedAvatar === i" class="check-icon">
                    <v-icon color="white" size="32">mdi-check-circle</v-icon>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- 按鈕區 -->
            <div class="text-center mt-8">
              <v-btn
                color="grey"
                size="large"
                variant="outlined"
                class="mr-4"
                @click="goBack"
              >
                <v-icon left class="mr-2">mdi-arrow-left</v-icon>
                取消
              </v-btn>
              <v-btn
                color="orange-darken-2"
                size="large"
                :loading="loading"
                :disabled="selectedAvatar === user.avatarSeed"
                @click="saveAvatar"
              >
                <v-icon left class="mr-2">mdi-check</v-icon>
                確認選擇
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'

const user = useUserStore()
const router = useRouter()
const createSnackbar = useSnackbar()

const selectedAvatar = ref(user.avatarSeed || 1)
const loading = ref(false)

const selectAvatar = (seed) => {
  selectedAvatar.value = seed
}

const saveAvatar = async () => {
  loading.value = true
  try {
    await serviceUser.updateAvatar(selectedAvatar.value)
    user.avatarSeed = selectedAvatar.value
    createSnackbar({
      text: '頭像已更新！✨',
      snackbarProps: { color: 'green', timeout: 2000 }
    })
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error) {
    console.error(error)
    createSnackbar({
      text: error?.response?.data?.message || '更新失敗',
      snackbarProps: { color: 'red' }
    })
  }
  loading.value = false
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.avatar-selector-container {
  min-height: 100vh;
  padding: 40px 16px;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCCBC 100%);
}

.avatar-card {
  border-radius: 24px !important;
  overflow: hidden;
}

/* 標題區 */
.avatar-header {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%);
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
}

/* 當前頭像 */
.current-avatar-section {
  background: #FFF8E1;
  padding: 24px;
  border-radius: 16px;
}

.current-avatar {
  border: 4px solid #FF9800;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3);
}

/* 頭像選項 */
.avatar-option {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  position: relative;
  overflow: visible;
  border-radius: 16px !important;
}

.avatar-option:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(255, 152, 0, 0.3);
}

.avatar-option.selected {
  border-color: #FF9800;
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.6) !important;
  transform: scale(1.08);
}

/* 編號標籤 */
.avatar-number {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(255, 152, 0, 0.95);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 選中圖標 */
.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #FF9800;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: checkBounce 0.3s ease;
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 響應式 */
@media (max-width: 960px) {
  .avatar-header {
    padding: 32px 20px;
  }

  .avatar-header h1 {
    font-size: 2rem !important;
  }

  .avatar-card :deep(.v-card-text) {
    padding: 24px 16px !important;
  }
}
</style>

<route lang="yaml">
meta:
  title: "選擇頭像"
  login: login-only
</route>
