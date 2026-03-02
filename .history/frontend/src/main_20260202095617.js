/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import serviceUser from '@/services/user'

// 引入 store 和 service
import { useUserStore } from '@/stores/user'

// Components
import App from './App.vue'
// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

// 在掛載應用之前初始化用戶資料
async function initApp () {
  const user = useUserStore()

  // 如果有 token，先載入用戶資料
  if (user.isLoggedIn) {
    try {
      const { data } = await serviceUser.profile()
      user.login(data.result)
    } catch (error) {
      console.log(error)
      user.logout()
    }
  }

  // 用戶資料載入完成後再掛載 app
  app.mount('#app')
}

// 執行初始化
initApp()
