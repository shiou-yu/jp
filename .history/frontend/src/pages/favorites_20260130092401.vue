default.vue:89
[Vue warn]: Unhandled error during execution of component update
  at <VApp>
  at <Default onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< Proxy(Object) {__v_skip: true}
 > >
  at <RouterView>
  at <App>
chunk-2MKFL3BX.js?v=16ea2b52:10754
Uncaught (in promise) TypeError: Cannot read properties of null (reading 'parentNode')    at parentNode (chunk-2MKFL3BX.js?v=16ea2b52:10754:30)    at ReactiveEffect.componentUpdateFn [as fn] (chunk-2MKFL3BX.js?v=16ea2b52:8296:11)    at ReactiveEffect.run (chunk-2MKFL3BX.js?v=16ea2b52:505:19)    at updateComponent (chunk-2MKFL3BX.js?v=16ea2b52:8143:18)    at processComponent (chunk-2MKFL3BX.js?v=16ea2b52:8077:7)    at patch (chunk-2MKFL3BX.js?v=16ea2b52:7562:11)    at patchKeyedChildren (chunk-2MKFL3BX.js?v=16ea2b52:8483:9)    at patchChildren (chunk-2MKFL3BX.js?v=16ea2b52:8397:11)    at processFragment (chunk-2MKFL3BX.js?v=16ea2b52:8040:9)    at patch (chunk-2MKFL3BX.js?v=16ea2b52:7536:9)

這個錯誤是什麼

Show more
上午8:56
這是一個 Vue.js 運行時錯誤,讓我為您解釋：

錯誤含義
核心問題：Vue 在更新組件時試圖訪問一個 DOM 節點的 parentNode 屬性,但該節點是 null(不存在)。

常見原因
DOM 節點已被移除 - 在 Vue 試圖更新之前,某個元素已經從 DOM 中刪除了
異步操作時序問題 - 例如在組件卸載後仍試圖更新 DOM
條件渲染問題 - v-if 或 v-show 導致元素不存在時仍被引用
直接操作 DOM - 使用 jQuery 或原生 JS 直接刪除了 Vue 管理的節點
排查建議
javascript
// 1. 檢查是否有直接的 DOM 操作
// 避免這樣做：
document.querySelector('.some-element').remove()

// 2. 檢查異步操作
// 確保在組件卸載前清理
onBeforeUnmount(() => {
  // 取消定時器、請求等
})

// 3. 使用 nextTick
await nextTick()
// 再進行 DOM 相關操作

// 4. 添加安全檢查
if (element && element.parentNode) {
  // 操作 DOM
}
快速修復方向
檢查 default.vue 第 89 行附近的代碼
查看是否有對 VApp 組件內元素的直接操作
確認路由切換時是否有未清理的副作用
需要看具體代碼才能給出更精確的解決方案。您能分享 default.vue 相關代碼嗎?

<template> <v-app> <v-app-bar color="white" elevation="0" style="border-bottom: 1px solid #ECEFF1; z-index: 1000;"> <v-container class="d-flex align-center"> <v-app-bar-title class="font-weight-bold text-blue-grey-darken-3" style="letter-spacing: 2px;"> 日本超商挖到寶 <sm

pasted

上午8:57
我找到問題了! 錯誤出在 第 89 行的 onUnmounted 生命週期鉤子中。

問題分析
您的布丁游標動畫使用了 requestAnimationFrame,但在組件卸載時可能會出現時序問題:

javascript
onUnmounted(() => {
  window.removeEventListener('mousemove', updateMouse)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
當路由切換時,Vue 試圖更新組件,但 DOM 節點已經被移除,導致無法找到 parentNode。

解決方案
將 onUnmounted 改為 onBeforeUnmount,在 DOM 移除之前清理:

vue
<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue' // 改這裡

// ... 其他代碼保持不變 ...

onBeforeUnmount(() => {  // 改這裡
  window.removeEventListener('mousemove', updateMouse)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// ... 其他代碼 ...
</script>
為什麼這樣修改?
鉤子	時機	適用場景
onUnmounted	DOM 已被移除後	清理非 DOM 相關資源
onBeforeUnmount	DOM 即將移除前	清理事件監聽、動畫
因為您的動畫可能還在運行並試圖訪問 DOM,所以需要在 DOM 移除前停止它。

完整修改後的代碼
vue
<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

// --- 🍮 游標平滑動效邏輯 ---
const mousePos = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
let animationFrameId = null

const updateMouse = (e) => {
  const deltaX = e.clientX - mousePos.value.x
  rotation.value = deltaX * 0.4
  mousePos.value.x = e.clientX
  mousePos.value.y = e.clientY
}

const animate = () => {
  puddingPos.value.x += (mousePos.value.x - puddingPos.value.x) * 0.2
  puddingPos.value.y += (mousePos.value.y - puddingPos.value.y) * 0.2
  animationFrameId = requestAnimationFrame(animate)
}

const puddingStyle = computed(() => ({
  transform: `translate3d(${puddingPos.value.x}px, ${puddingPos.value.y}px, 0) rotate(${rotation.value}deg)`,
}))

onMounted(() => {
  window.addEventListener('mousemove', updateMouse)
  animate()
})

onBeforeUnmount(() => {  // ✅ 改這裡
  window.removeEventListener('mousemove', updateMouse)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// ... 其餘代碼保持不變 ...
</script>
這樣修改後,錯誤應該就會消失了! 🍮✨

改好的整份給我可以嗎

上午8:58

創建修復後的 default.vue 文件
default.vue

Presented file
已經幫您修復好了! 🍮✨

主要修改
第 68 行:

❌ import { computed, onMounted, onUnmounted, ref } from 'vue'
✅ import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
第 89 行:

❌ onUnmounted(() => {
✅ onBeforeUnmount(() => {
這樣就能確保在 DOM 移除之前就停止動畫和清理事件監聽器,避免 Vue 在更新時找不到 parentNode 的錯誤了!

Default
VUE
__chunk-2MKFL3BX.js?v=16ea2b52:10754__ Uncaught (in promise) TypeError: Cannot read properties of null (reading 'parentNode')     at parentNode (__chunk-2MKFL3BX.js?v=16ea2b52:10754:30__)     at ReactiveEffect.componentUpdateFn [as fn] (__chunk-2MKFL3BX.js?v=16ea2b52:8296:11__)     at ReactiveEffect.run (__chunk-2MKFL3BX.js?v=16ea2b52:505:19__)     at updateComponent (__chunk-2MKFL3BX.js?v=16ea2b52:8143:18__)     at processComponent (__chunk-2MKFL3BX.js?v=16ea2b52:8077:7__)     at patch (__chunk-2MKFL3BX.js?v=16ea2b52:7562:11__)     at patchKeyedChildren (__chunk-2MKFL3BX.js?v=16ea2b52:8483:9__)     at patchChildren (__chunk-2MKFL3BX.js?v=16ea2b52:8397:11__)     at processFragment (__chunk-2MKFL3BX.js?v=16ea2b52:8040:9__)     at patch (__chunk-2MKFL3BX.js?v=16ea2b52:7536:9__)
__default.vue:89__ [Vue warn]: Unhandled error during execution of component update    at <VApp>    at <Default onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref
1. Proxy(Object) {__v_skip: true}
 > >    at <RouterView>    at <App>

一樣不行

Show more
上午9:00
看來問題不只是生命週期的問題。讓我deeper分析一下，這個錯誤發生在 router-view 切換時。

讓我檢查並提供更完整的解決方案：

創建修復版本的 default.vue，添加更多防禦性檢查
default-fixed.vue

Presented file
🔧 關鍵修復點
這次我做了多層防護來解決問題：

1. 添加掛載狀態控制 (最重要!)
javascript
const isMounted = ref(false)
const isAnimating = false
html
<div v-if="isMounted" class="pudding-cursor" :style="puddingStyle">
確保布丁游標只在組件完全掛載後才渲染
2. 使用 nextTick 確保 DOM 就緒
javascript
onMounted(async () => {
  await nextTick()  // 等待 DOM 更新完成
  isAnimating = true
  isMounted.value = true
  // ...
})
3. 添加動畫狀態檢查
javascript
const updateMouse = (e) => {
  if (!isAnimating) return  // 防止卸載後還執行
  // ...
}

const animate = () => {
  if (!isAnimating) return  // 防止卸載後還執行
  // ...
}
4. 添加路由過渡動畫
html
<transition name="fade" mode="out-in">
  <div :key="route.path" style="min-height: 100%">
    <component :is="Component" />
  </div>
</transition>
mode="out-in" 確保舊組件先完全卸載，再掛載新組件
5. 事件監聽器優化
javascript
window.addEventListener('mousemove', updateMouse, { passive: true })
添加 passive: true 提升性能
6. 完整清理
javascript
onBeforeUnmount(() => {
  isAnimating = false        // 先停止動畫
  isMounted.value = false    // 隱藏游標
  window.removeEventListener('mousemove', updateMouse)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null  // 清空引用
  }
})
試試這個版本，應該就能完全解決問題了! 🍮✨

Default fixed
VUE
__chunk-2MKFL3BX.js?v=16ea2b52:10754__ Uncaught (in promise) TypeError: Cannot read properties of null (reading 'parentNode')     at parentNode (__chunk-2MKFL3BX.js?v=16ea2b52:10754:30__)     at ReactiveEffect.componentUpdateFn [as fn] (__chunk-2MKFL3BX.js?v=16ea2b52:8296:11__)     at ReactiveEffect.run (__chunk-2MKFL3BX.js?v=16ea2b52:505:19__)     at updateComponent (__chunk-2MKFL3BX.js?v=16ea2b52:8143:18__)     at processComponent (__chunk-2MKFL3BX.js?v=16ea2b52:8077:7__)     at patch (__chunk-2MKFL3BX.js?v=16ea2b52:7562:11__)     at patchKeyedChildren (__chunk-2MKFL3BX.js?v=16ea2b52:8483:9__)     at patchChildren (__chunk-2MKFL3BX.js?v=16ea2b52:8397:11__)     at processFragment (__chunk-2MKFL3BX.js?v=16ea2b52:8040:9__)     at patch (__chunk-2MKFL3BX.js?v=16ea2b52:7536:9__)

Show more
上午9:03
看來問題更深層。這個錯誤發生在 patchKeyedChildren，表示是 Vue 在比對子元素時出錯。讓我檢查 router-view 的實現方式：

創建徹底修復版本，簡化 router-view 結構
default-simple.vue

Presented file
🎯 關鍵修改
我簡化了 router-view 的結構，這是導致錯誤的根源：

❌ 原本的寫法（有問題）
html
<router-view v-slot="{ Component, route }">
  <div :key="route.path" style="min-height: 100%">
    <component :is="Component" />
  </div>
</router-view>
✅ 修改後的寫法
html
<router-view></router-view>
為什麼原本的寫法會出錯？
:key="route.path" 導致 Vue 強制重新創建元素
在路由切換時，Vue 嘗試比對子元素 (patchKeyedChildren)
但因為 key 改變，Vue 認為是新元素，試圖刪除舊的
舊元素的 parentNode 已經是 null，導致錯誤
如果你需要路由過渡動畫
可以在 router 配置 中處理，或用這個更安全的寫法：

html
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
試試這個簡化版本，應該能解決問題！如果還是不行，可能需要檢查子組件（各個頁面組件）是否也有類似問題。

Default simple
VUE
可能是我的app.vue 也有問題

<template>
  <div id="app">
    <div class="cursor-dot" :style="dotStyle"></div>

    <div class="cursor-pudding" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0) // 控制布丁傾斜角度
const scale = ref(1) // 控制點擊時的 Q 彈感

window.addEventListener('mousemove', (e) => {
  // 計算傾斜角度：移動越快，傾斜越多
  const deltaX = e.clientX - mouse.value.x
  rotation.value = deltaX * 0.5 // 係數可調整

  mouse.value.x = e.clientX
  mouse.value.y = e.clientY
})

// 點擊時縮小一下，增加 Q 彈感
window.addEventListener('mousedown', () => scale.value = 0.8)
window.addEventListener('mouseup', () => scale.value = 1)

const update = () => {
  // Lerp 平滑跟隨
  puddingPos.value.x += (mouse.value.x - puddingPos.value.x) * 0.15
  puddingPos.value.y += (mouse.value.y - puddingPos.value.y) * 0.15
  requestAnimationFrame(update)
}

const puddingStyle = computed(() => ({
  transform: `translate(${puddingPos.value.x}px, ${puddingPos.value.y}px)
              rotate(${rotation.value}deg)
              scale(${scale.value})`,
  transition: 'transform 0.1s ease-out',
}))

// 圓圈跟得更慢，製造延遲美感
const dotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
  transition: 'all 0.3s ease-out',
}))

onMounted(() => update())
</script>

<style scoped>
/* 全域隱藏原生滑鼠 */
:global(html), :global(body) {
  cursor: none !important;
}

.cursor-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  background: rgba(255, 236, 179, 0.4); /* 奶油色半透明 */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
}

.cursor-pudding {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px; /* 根據需求調整大小 */
  height: 40px;
  pointer-events: none;
  z-index: 9999;
  margin-top: -20px;
  margin-left: -20px;
}

.cursor-pudding img {
  width: 100%;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}
</style>
Show more
上午9:05
找到了！App.vue 和 default.vue 都在做游標動畫，導致衝突！而且 App.vue 的事件監聽器沒有清理。

讓我修復這兩個文件：

3 steps

創建清理後的 default.vue
default.vue

Presented 2 files
🎯 問題根源與解決方案
❌ 原本的問題
App.vue 和 default.vue 都在做游標動畫 → 重複且衝突
App.vue 的事件監聽器沒有清理 → 導致路由切換時出錯
default.vue 的 router-view 使用了 :key → 導致 Vue diff 算法出錯
✅ 修復方案
App.vue 的修改
✅ 添加 isMounted 狀態控制
✅ 添加 isAnimating 旗標
✅ 使用 onBeforeUnmount 清理所有事件
✅ 取消 requestAnimationFrame
✅ 所有事件監聽器改用具名函數（方便移除）
✅ 添加 { passive: true } 優化性能
default.vue 的修改
✅ 完全移除游標動畫邏輯（已經在 App.vue 處理）
✅ 簡化 router-view 為 <router-view></router-view>
✅ 移除不必要的生命週期鉤子
📁 檔案結構
App.vue          → 處理全域游標動畫 🍮
├── router-view
    └── default.vue  → 只處理導覽列和頁面佈局
        └── router-view  → 實際的頁面內容
🔍 關鍵改進對比
項目	原本 ❌	修復後 ✅
游標邏輯	兩個檔案都有	只在 App.vue
事件清理	沒有清理	完整清理
動畫停止	沒有停止	有停止旗標
router-view	複雜的 slot + key	簡單標籤
現在應該完全沒問題了！兩個文件都已經修復好了 🎉

App
VUE
Default
VUE
__favorites.vue:116__ [Vue warn]: Unhandled error during execution of component update    at <VCol cols="12" >    at <VRow>    at <VContainer>    at <Favorites onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref
1. Proxy(Object) {__v_skip: true}
 > >    at <RouterView>    at <VMain style=
1. {background-color: '
#FFF9F0'}
 >    at <VApp>    at <Default onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref
1. Proxy(Object) {__v_skip: true}
 > >    at <RouterView>    at <App>
__favorites.vue:56__ Uncaught (in promise) TypeError: Cannot read properties of null (reading 'rating')     at __favorites.vue:56:44__

Show more
上午9:16
現在錯誤在 favorites.vue 第 56 行，嘗試讀取 null 的 rating 屬性。請分享 favorites.vue 的代碼，我來幫你修復！

可以把文件內容貼上來嗎？特別是第 56 行附近的代碼。

<template> <v-container> <v-row> <v-col cols="12"> <h1 class="text-center font-weight-bold text-grey">❤️ 我的收藏清單</h1> <div class="text-center text-grey">那些想吃、必吃、還沒吃的都在這裡</div> </v-col> <v-divider class="my-4"></v-divider> <v-col cols="12">

pasted

上午9:16
找到問題了！第 56 行嘗試訪問 item.product.rating，但 item.product 可能是 null。讓我修復這個文件：

修復 favorites.vue，添加防禦性檢查避免 null 錯誤
favorites.vue

Presented file
🔧 修復內容
問題根源
後端返回的 cart 陣列中，某些項目的 product 可能是 null（商品可能已被刪除），導致訪問 item.product.rating 時出錯。

✅ 主要修改
1. 添加 validCart 計算屬性（最重要！）
javascript
const validCart = computed(() => {
  return cart.value.filter(item => item && item.product)
})
過濾掉 product 為 null 的項目
只顯示有效的收藏
2. 模板改用 validCart
html
<!-- 原本 -->
v-for="(item, i) in cart"

<!-- 修改後 -->
v-for="(item, i) in validCart"
3. 添加防禦性檢查
javascript
// getCart 函數
cart.value = data.result || []  // 確保至少是空陣列

// deleteItem 函數
const actualIndex = cart.value.findIndex(cartItem => cartItem._id === item._id)
if (actualIndex !== -1) {
  cart.value.splice(actualIndex, 1)
}
4. 改善錯誤處理
javascript
catch (error) {
  console.error('取得收藏清單失敗:', error)  // 記錄詳細錯誤
  createSnackbar({ ... })
}
🎯 為什麼會出現 null 的 product？
可能的情況：

管理員刪除了某個商品
商品暫時下架
資料庫關聯出錯
使用 validCart 過濾後，這些「失效收藏」就不會顯示，避免錯誤！

現在應該完全正常了 ✨

Favorites
VUE
我的導覽列    收藏清單  不會顯示收藏數量 可以加上去?

上午9:20
好的！讓我修改 default.vue，在收藏清單按鈕上添加數量徽章：

在收藏清單按鈕上添加數量徽章
+18
-18
default.vue

Presented file
完成了！✨

🎯 修改內容
將徽章條件從：

javascript
v-if="nav.to === '/cart' && user.cart > 0"
改為：

javascript
v-if="(nav.to === '/cart' || nav.to === '/favorites') && user.cart > 0"
現在收藏清單和購物車（如果你有的話）都會顯示收藏數量的紅色徽章了！

顯示效果：
首頁：無徽章
註冊：無徽章
登入：無徽章
收藏清單 ❤️ 3 ← 會顯示數字！
管理：無徽章
數字會根據 user.cart 的值動態更新 🎉

Default
VUE
取消收藏  數量不會改耶?

上午9:23
問題在於刪除時沒有正確更新數量！讓我修復 favorites.vue：

修復刪除收藏時更新數量的邏輯
+30
-30
favorites.vue

Presented file
🔧 修復內容
問題根源
原本的順序是：

先更新 Pinia：user.cart = data.result
再刪除陣列項目
但 data.result 可能不是正確的數量！

✅ 修改後的順序
javascript
// 1. 先從畫面陣列移除
const actualIndex = cart.value.findIndex(cartItem => cartItem._id === item._id)
if (actualIndex !== -1) {
  cart.value.splice(actualIndex, 1)
}

// 2. 再更新 Pinia 狀態（使用正確的長度）
user.cart = cart.value.length  // ← 關鍵！
現在刪除收藏時：

❤️ 3 → 刪除一個 → ❤️ 2 → 刪除一個 → ❤️ 1 → 刪除一個 → ❤️ 消失
數量會即時更新了！🎉

Favorites
VUE

Claude is AI and can make mistakes. Please double-check responses.
Favorites · VUE
Copy

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center font-weight-bold text-grey">❤️ 我的收藏清單</h1>
        <div class="text-center text-grey">那些想吃、必吃、還沒吃的都在這裡</div>
      </v-col>

      <v-divider class="my-4"></v-divider>

      <v-col cols="12">
        <div v-if="cart.length === 0" class="text-center my-10 text-grey">
          <v-icon class="mb-3" icon="mdi-heart-broken" size="64"></v-icon>
          <h3>您還沒有收藏任何商品喔</h3>
          <v-btn class="mt-4" color="primary" to="/" variant="tonal">去首頁逛逛</v-btn>
        </div>

        <v-list v-else class="bg-transparent" lines="three">
          <v-list-item
            v-for="(item, i) in validCart"
            :key="item._id"
            class="mb-3 rounded-lg elevation-2 bg-white pa-4"
            @click="$router.push('/product/' + item.product._id)"
          >
            <template #prepend>
              <v-avatar class="me-4" rounded="lg" size="100">
                <v-img class="bg-grey-lighten-2" cover :src="item.product.imageUrl"></v-img>
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 font-weight-bold mb-1">
              {{ item.product.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="d-flex align-center mt-1">
              <span class="text-primary text-subtitle-1 font-weight-bold me-3">
                ¥{{ item.product.price }}
              </span>
              <v-chip
                v-if="item.product.store"
                class="me-2"
                :color="getStoreColor(item.product.store)"
                label
                size="x-small"
                text-color="white"
              >
                {{ item.product.store }}
              </v-chip>
            </v-list-item-subtitle>

            <div class="mt-2 d-flex align-center">
              <v-rating
                color="amber"
                density="compact"
                half-increments
                :model-value="item.product.rating || 0"
                readonly
                size="small"
              ></v-rating>
              <span class="text-caption text-grey ms-2">
                ({{ item.product.rating || 0 }}分)
              </span>
            </div>

            <template #append>
              <div class="d-flex flex-column align-center">
                <v-tooltip location="top" text="取消收藏">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red-lighten-1"
                      icon="mdi-delete-outline"
                      size="large"
                      variant="text"
                      @click.stop="deleteItem(item, i)"
                    ></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const user = useUserStore()

const cart = ref([])

// 過濾掉 product 為 null 的項目
const validCart = computed(() => {
  return cart.value.filter(item => item && item.product)
})

// 輔助函式：取得超商顏色 (雖然卡片也有寫，但這裡是列表頁，手動配一下顏色比較保險)
const getStoreColor = (storeName) => {
  switch (storeName) {
  case '7-11': { return '#F58220'
  }
  case '全家': { return '#009944'
  }
  case 'Lawson': { return '#006CB7'
  }
  default: { return 'grey'
  }
  }
}

const getCart = async () => {
  try {
    const { data } = await serviceUser.getCart()
    cart.value = data.result || []
  } catch (error) {
    console.error('取得收藏清單失敗:', error)
    createSnackbar({
      text: '取得收藏清單失敗',
      snackbarProps: { color: 'red' },
    })
  }
}
getCart()

// 刪除邏輯
const deleteItem = async (item, i) => {
  try {
    // 傳送 quantity: 0 給後端，代表刪除
    await serviceUser.cart({
      product: item.product._id,
      quantity: 0,
    })

    // 從目前的畫面陣列移除，讓使用者立刻感覺到「刪掉了」
    const actualIndex = cart.value.findIndex(cartItem => cartItem._id === item._id)
    if (actualIndex !== -1) {
      cart.value.splice(actualIndex, 1)
    }

    // 更新 Pinia 狀態 (讓右上角的數字變動)
    user.cart = cart.value.length

    createSnackbar({
      text: '已取消收藏',
      snackbarProps: { color: 'success' },
    })
  } catch (error) {
    console.error('刪除失敗:', error)
    createSnackbar({
      text: '刪除失敗，請稍後再試',
      snackbarProps: { color: 'red' },
    })
  }
}
</script>

<route lang="yaml">
meta:
  title: "私藏清單 — My Favorites"
  login: login-only
</route>
