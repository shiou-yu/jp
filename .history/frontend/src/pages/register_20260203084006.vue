<template>
  <v-container class="register-container" fluid>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" lg="4" md="6" sm="8">
        <v-card class="register-card" elevation="8">
          <!-- 標題區 -->
          <div class="register-header">
            <v-icon color="white" size="64">mdi-account-plus</v-icon>
            <h1 class="text-h3 font-weight-bold text-white mt-4">註冊帳號</h1>
            <p class="text-subtitle-1 text-white mt-2 opacity-90">開始您的購物之旅</p>
          </div>

          <!-- 表單區 -->
          <v-card-text class="pa-8">
            <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
              <v-text-field
                v-model="account.value.value"
                color="orange-darken-2"
                counter
                :error-messages="account.errorMessage.value"
                hint="長度 4 ~ 20 的英數字"
                label="帳號"
                maxlength="20"
                minlength="4"
                class="mb-2 rounded-field"
                prepend-inner-icon="mdi-account"
                rounded="lg"
                variant="outlined"
              />
              <v-text-field
                v-model="password.value.value"
                color="orange-darken-2"
                counter
                :error-messages="password.errorMessage.value"
                hint="長度 4 ~ 20 的英數字"
                label="密碼"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-lock"
                type="password"
                class="mb-2 rounded-field"
                variant="outlined"
                rounded="lg"
              />
              <v-text-field
                v-model="confirmPassword.value.value"
                color="orange-darken-2"
                counter
                :error-messages="confirmPassword.errorMessage.value"
                hint="長度 4 ~ 20 的英數字"
                label="確認密碼"
                maxlength="20"
                minlength="4"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                class="mb-4 rounded-field"
                variant="outlined"
                rounded="lg"
              />
              <v-btn
                block
                class="font-weight-bold text-h6 rounded-btn"
                color="orange-darken-2"
                elevation="4"
                :loading="form.isSubmitting.value"
                rounded="lg"
                size="x-large"
                type="submit"
              >
                <v-icon class="mr-2" left>mdi-rocket-launch</v-icon>
                立即註冊
              </v-btn>
            </v-form>

            <!-- 登入連結 -->
            <div class="text-center mt-6">
              <span class="text-grey-darken-1">已經有帳號了？</span>
              <v-btn
                class="font-weight-bold"
                color="orange-darken-2"
                to="/login"
                variant="text"
              >
                立即登入
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
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import serviceUser from '@/services/user'

const createSnackbar = useSnackbar()
const router = useRouter()

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
  confirmPassword: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少 4 個字')
    .max(20, '密碼最多 20 個字')
    .test('isAscii', '密碼只能是英數字', (value) => validator.isAscii(value))
    .oneOf([yup.ref('password')], '密碼不一致'),
})

const form = useForm({
  validationSchema: schema,
  initialValues: {
    account: '',
    password: '',
    confirmPassword: '',
  },
})

const account = useField('account')
const password = useField('password')
const confirmPassword = useField('confirmPassword')

const submit = form.handleSubmit(async (values) => {
  try {
    await serviceUser.create(values)
    createSnackbar({
      text: '註冊成功 🎉',
      snackbarProps: {
        color: 'green',
      },
    })
    router.push('/login')
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
.register-container {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 50%, #FFCCBC 100%);
  padding: 40px 16px;
}

.register-card {
  border-radius: 24px !important;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
}

/* 漸層標題區 */
.register-header {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%);
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.3);
}

/* 圓角輸入框 */
.rounded-field :deep(.v-field) {
  border-radius: 16px;
  border: 2px solid rgba(255, 152, 0, 0.2);
  transition: all 0.3s ease;
}

.rounded-field :deep(.v-field:hover) {
  border-color: rgba(255, 152, 0, 0.4);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.1);
}

.rounded-field :deep(.v-field--focused) {
  border-color: #FF9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
}

/* 圓角按鈕 */
.rounded-btn {
  border-radius: 16px !important;
  text-transform: none;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.rounded-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4) !important;
}

.rounded-btn:active {
  transform: translateY(0);
}

/* 響應式調整 */
@media (max-width: 600px) {
  .register-header {
    padding: 32px 24px;
  }

  .register-header h1 {
    font-size: 2rem !important;
  }

  .register-card :deep(.v-card-text) {
    padding: 24px !important;
  }
}
</style>

<route lang="yaml">
meta:
  title: 註冊
  login: no-login-only
</route>
