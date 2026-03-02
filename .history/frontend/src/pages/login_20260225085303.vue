<template>
  <v-container class="login-container" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="login-card" elevation="8">
          <!-- 標題區 -->
          <div class="login-header">
            <v-icon color="white" size="64">mdi-login</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">歡迎回來</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">繼續探索超商美食世界</p>
          </div>

          <!-- 表單區 -->
          <v-card-text class="pa-8">
            <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
              <v-text-field
                v-model="account.value.value"
                class="mb-2 rounded-field"
                color="blue-darken-2"
                counter
                :error-messages="account.errorMessage.value"
                hint="長度 4 ~ 20 的英數字"
                label="帳號"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-account-circle"
                rounded="lg"
                variant="outlined"
              />
              <v-text-field
                v-model="password.value.value"
                class="mb-4 rounded-field"
                color="blue-darken-2"
                counter
                :error-messages="password.errorMessage.value"
                hint="長度 4 ~ 20 的英數字"
                label="密碼"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-lock-outline"
                rounded="lg"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template #append-inner>
                  <v-btn
                    density="compact"
                    :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="text"
                    @click="showPassword = !showPassword"
                  ></v-btn>
                </template>
              </v-text-field>
              <v-btn
                block
                class="font-weight-bold text-h6 rounded-btn"
                color="#85C1E9"
                elevation="4"
                :loading="form.isSubmitting.value"
                rounded="lg"
                size="x-large"
                type="submit"
              >
                <v-icon class="mr-2" left>mdi-login-variant</v-icon>
                登入
              </v-btn>
            </v-form>

            <!-- 註冊連結 -->
            <div class="text-center mt-6">
              <span class="text-blue-grey-darken-1">還沒有帳號？</span>
              <v-btn
                class="font-weight-bold"
                color="blue-darken-2"
                to="/register"
                variant="text"
              >
                立即註冊
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import validator from 'validator'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const router = useRouter()
const user = useUserStore()

// 顯示/隱藏密碼
const showPassword = ref(false)

const schema = yup.object({
  account: yup
    .string()
    .required('帳號必填')
    .min(4, '帳號最少 4 個字')
    .max(20, '帳號最多 20 個字')
    .test('isAlphanumeric', '帳號只能是英數字', (value) => validator.isAlphanumeric(value)),
  password: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少 4 個字')
    .max(20, '密碼最多 20 個字')
    .test('isAscii', '密碼只能是英數字', (value) => validator.isAscii(value)),
})

const form = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    password: '',
  },
})

const account = useField('account')
const password = useField('password')

const submit = form.handleSubmit(async (values) => {
  try {
    const { data } = await serviceUser.login(values)
    user.login(data.result)
    createSnackbar({
      text: '登入成功 🎉 歡迎回來！',
      snackbarProps: {
        color: 'blue-darken-2',
      },
    })
    router.push('/')
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({
      text,
      snackbarProps: {
        color: 'red',
      },
    })
  }
})
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #EBF5FB 0%, #D6EAF8 50%, #AED6F1 100%);
  padding: 40px 16px;
}

.login-card {
  border-radius: 24px !important;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff !important;
}

/* 藍色漸層標題區 */
.login-header {
  background: linear-gradient(135deg, #AED6F1 0%, #7FB3D3 50%, #5DADE2 100%);
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(93, 173, 226, 0.25);
}

/* 圓角輸入框 */
.rounded-field :deep(.v-field) {
  border-radius: 16px;
  border: 2px solid rgba(93, 173, 226, 0.2);
  transition: all 0.3s ease;
  background-color: #ffffff !important;
}

.rounded-field :deep(.v-field__overlay) {
  background-color: transparent !important;
  opacity: 0 !important;
}

.rounded-field :deep(.v-field:hover) {
  border-color: rgba(93, 173, 226, 0.4);
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.1);
}

.rounded-field :deep(.v-field--focused) {
  border-color: #5DADE2;
  box-shadow: 0 0 0 3px rgba(93, 173, 226, 0.15);
}

/* 圓角按鈕 */
.rounded-btn {
  border-radius: 16px !important;
  text-transform: none;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
}

.rounded-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(93, 173, 226, 0.45) !important;
}

.rounded-btn:active {
  transform: translateY(0);
}

/* 表單區強制白底深字 */
.login-card :deep(.v-card-text) {
  background-color: #ffffff !important;
  color: #37474f !important;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .login-header {
    padding: 32px 24px;
  }

  .login-header h1 {
    font-size: 2rem !important;
  }

  .login-card :deep(.v-card-text) {
    padding: 24px !important;
  }
}
</style>

<route lang="yaml">
meta:
  title: 登入
  login: no-login-only
</route>
