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
:global(html), :global(body) { cursor: none !important;
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
