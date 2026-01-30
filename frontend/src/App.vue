<template>
  <div id="app">
    <div v-if="isMounted" class="cursor-dot" :style="dotStyle"></div>

    <div v-if="isMounted" class="cursor-pudding" :style="puddingStyle">
      <img alt="pudding" src="/img/pudding.png" />
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()

const isMounted = ref(false)
const mouse = ref({ x: 0, y: 0 })
const puddingPos = ref({ x: 0, y: 0 })
const rotation = ref(0)
const scale = ref(1)
let animationFrameId = null
let isAnimating = false

const handleMouseMove = (e) => {
  if (!isAnimating) return
  const deltaX = e.clientX - mouse.value.x
  rotation.value = deltaX * 0.5
  mouse.value.x = e.clientX
  mouse.value.y = e.clientY
}

const handleMouseDown = () => {
  if (isAnimating) scale.value = 0.8
}

const handleMouseUp = () => {
  if (isAnimating) scale.value = 1
}

const update = () => {
  if (!isAnimating) return
  puddingPos.value.x += (mouse.value.x - puddingPos.value.x) * 0.15
  puddingPos.value.y += (mouse.value.y - puddingPos.value.y) * 0.15
  animationFrameId = requestAnimationFrame(update)
}

const puddingStyle = computed(() => ({
  transform: `translate(${puddingPos.value.x}px, ${puddingPos.value.y}px)
              rotate(${rotation.value}deg)
              scale(${scale.value})`,
  transition: 'transform 0.1s ease-out',
}))

const dotStyle = computed(() => ({
  left: `${mouse.value.x}px`,
  top: `${mouse.value.y}px`,
  transition: 'all 0.3s ease-out',
}))

onMounted(async () => {
  isAnimating = true
  isMounted.value = true
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('mousedown', handleMouseDown, { passive: true })
  window.addEventListener('mouseup', handleMouseUp, { passive: true })
  update()

  // 如果已登入，獲取用戶資料
  if (user.isLoggedIn) {
    await user.getUser()
  }
})

onBeforeUnmount(() => {
  isAnimating = false
  isMounted.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})
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
  width: 40px;
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
