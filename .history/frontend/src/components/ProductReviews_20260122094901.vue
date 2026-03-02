<template>
  <div style="background: white; color: red; padding: 10px; border: 2px solid red;">
    測試 props.image 是否有值：{{ image }} <br>
    測試 imageUrl 是否拼湊成功：{{ imageUrl }}
  </div>

  <v-card class="mt-8 rounded-xl" ...>

<template>
  <v-card class="mt-8 rounded-xl" color="transparent" flat>
    <v-card-title class="text-h5 font-weight-bold text-brown-darken-2 mb-4 d-flex align-center">
      <v-icon icon="mdi-comment-text-outline" start></v-icon>
      大家的心得
    </v-card-title>

    <div class="d-flex align-center mb-6 ml-4">
      <v-avatar class="mr-4 border-dashed bg-white" rounded="lg" size="80">
        <v-img cover :src="imageUrl"></v-img>
      </v-avatar>
      <div>
        <div class="text-subtitle-1 text-grey">正在評論：</div>
        <div class="text-h6 text-brown-darken-3 font-weight-bold">{{ name }}</div>
      </div>
    </div>

    <v-card-text>
      <div v-if="user.isLoggedIn" class="bg-white pa-6 rounded-lg elevation-2 mb-8 border-s-lg border-amber">
        <div class="d-flex align-center mb-3">
          <v-avatar class="mr-3" color="amber-lighten-4">
            <span class="text-brown font-weight-bold">{{ user.account?.charAt(0)?.toUpperCase() }}</span>
          </v-avatar>
          <div class="font-weight-bold text-brown-darken-2">寫下您的評論...</div>
        </div>

        <v-form :disabled="isSubmitting" @submit.prevent="submitReview">
          <div class="mb-2">
            <span class="text-caption text-grey mr-2">給個評分：</span>
            <v-rating
              v-model="form.rating"
              active-color="amber-darken-2"
              color="amber-darken-2"
              density="compact"
              hover
            ></v-rating>
          </div>

          <v-textarea
            v-model="form.comment"
            auto-grow
            bg-color="grey-lighten-5"
            class="mb-4"
            color="brown"
            hide-details="auto"
            label="口感如何？推薦嗎？"
            rows="3"
            variant="outlined"
          ></v-textarea>

          <div class="text-right">
            <v-btn
              class="text-white px-6"
              color="amber-darken-4"
              :loading="isSubmitting"
              rounded="pill"
              type="submit"
            >
              送出評論
            </v-btn>
          </div>
        </v-form>
      </div>

      <v-alert
        v-else
        class="mb-8"
        color="brown"
        icon="mdi-account-lock"
        type="info"
        variant="tonal"
      >
        想要分享心得嗎？請先 <router-link class="font-weight-bold text-brown text-decoration-underline" to="/login">登入</router-link>
      </v-alert>

      <div v-if="reviews.length === 0" class="text-center text-grey py-8 bg-amber-lighten-5 rounded-lg border-dashed">
        <v-icon class="mb-2" icon="mdi-comment-off-outline" size="large"></v-icon>
        <div>目前還沒有評論，快來搶頭香！</div>
      </div>

      <v-list v-else bg-color="transparent" class="pa-0">
        <v-list-item
          v-for="review in reviews"
          :key="review._id"
          class="bg-white rounded-lg mb-4 elevation-1 pa-4"
        >
          <template #prepend>
            <v-avatar color="amber-lighten-5" size="48">
              <span class="text-brown-darken-3 font-weight-bold text-h6">
                {{ review.user?.account?.charAt(0)?.toUpperCase() || 'U' }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title class="d-flex align-center flex-wrap mb-1">
            <span class="font-weight-bold mr-3 text-brown-darken-3 text-h6">
              {{ review.user?.account || '神秘客' }}
            </span>
            <v-rating
              active-color="amber"
              color="amber"
              density="compact"
              :model-value="review.rating"
              readonly
              size="small"
            ></v-rating>
          </v-list-item-title>

          <v-list-item-subtitle class="text-caption text-grey mb-3">
            {{ new Date(review.date).toLocaleDateString() }}
          </v-list-item-subtitle>

          <div class="text-body-1 text-grey-darken-3" style="white-space: pre-wrap;">{{ review.comment }}</div>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue' // ✨ 已加入 computed
import { useSnackbar } from 'vuetify-use-dialog'
import { api, apiAuth } from '@/plugins/axios'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '此商品',
  },
})

// ✨ 核心修正：組合 Cloudinary 完整網址
const imageUrl = computed(() => {
  if (!props.image) return 'https://via.placeholder.com/200?text=No+Image'

  // 如果已經是完整網址 (http 開頭)，直接回傳
  if (props.image.startsWith('http')) return props.image

  // 拼接 Cloudinary 網址
  const cloudName = 'dyosa5byh'
  return `https://res.cloudinary.com/${cloudName}/image/upload/${props.image}`
})

const user = useUserStore()
const createSnackbar = useSnackbar()

const reviews = ref([])
const isSubmitting = ref(false)
const form = reactive({
  rating: 5,
  comment: '',
})

const fetchReviews = async () => {
  try {
    const { data } = await api.get(`/product/${props.id}/rating`)
    reviews.value = data.result
  } catch (error) {
    console.error('取得評論失敗', error)
  }
}

const submitReview = async () => {
  if (!form.comment.trim()) {
    createSnackbar({ text: '請輸入內容', snackbarProps: { color: 'red' } })
    return
  }
  isSubmitting.value = true
  try {
    await apiAuth.post(`/product/${props.id}/rating`, form)
    createSnackbar({ text: '評論成功！', snackbarProps: { color: 'green' } })
    form.comment = ''
    form.rating = 5
    fetchReviews()
  } catch {
    createSnackbar({ text: '評論失敗', snackbarProps: { color: 'red' } })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #D7CCC8;
}
.border-s-lg {
  border-left-width: 6px !important;
}
</style>
