<template>
  <v-container class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-carousel
          class="rounded-xl shadow-lg"
          cycle
          :height="carouselHeight"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            cover
            :src="slide.src"
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          精選商品
        </h1>
        <p class="text-blue-grey-darken-1 mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          bg-color="white"
          class="rounded-lg shadow-sm"
          clearable
          color="blue-grey-darken-3"
          flat
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="blue-grey-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip
            bg-color="grey-lighten-4"
            class="text-blue-grey-darken-3 font-weight-bold px-4 rounded-pill"
            filter
            value="全部"
            variant="flat"
          >全部</v-chip>

          <v-chip
            bg-color="pink-lighten-5"
            class="text-pink-darken-2 font-weight-bold rounded-pill"
            filter
            value="甜點"
            variant="flat"
          >甜點 🍰</v-chip>
          <v-chip
            bg-color="orange-lighten-5"
            class="text-orange-darken-4 font-weight-bold rounded-pill"
            filter
            value="零食"
            variant="flat"
          >零食 🍪</v-chip>
          <v-chip
            bg-color="amber-lighten-5"
            class="text-brown-darken-2 font-weight-bold rounded-pill"
            filter
            value="熟食"
            variant="flat"
          >熟食 🍱</v-chip>
          <v-chip
            bg-color="blue-lighten-5"
            class="text-blue-darken-4 font-weight-bold rounded-pill"
            filter
            value="冰品"
            variant="flat"
          >冰品 🍦</v-chip>
          <v-chip
            bg-color="red-lighten-5"
            class="text-red-darken-4 font-weight-bold rounded-pill"
            filter
            value="泡麵"
            variant="flat"
          >泡麵 🍜</v-chip>
        </v-chip-group>

        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>

        <v-chip-group v-model="store" @update:model-value="fetchProducts">
          <v-chip
            class="font-weight-black rounded-lg px-5"
            color="deep-orange-darken-2"
            style="border-width: 2px;"
            value="7-11"
            variant="outlined"
          >7-11</v-chip>

          <v-chip
            class="font-weight-black rounded-lg px-5"
            color="green-darken-2"
            style="border-width: 2px;"
            value="全家"
            variant="outlined"
          >全家</v-chip>

          <v-chip
            class="font-weight-black rounded-lg px-5"
            color="blue-darken-2"
            style="border-width: 2px;"
            value="Lawson"
            variant="outlined"
          >Lawson</v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <v-row>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  background-color: #FFF9F0 !important;
  min-height: 100vh;
  max-width: 100% !important;
}

:deep(.v-row) {
  margin: 0;
}

/* 種類標籤(圓形)選中後的樣式 */
:deep(.rounded-pill.v-chip--selected) {
  color: white !important;
}

/* 超商標籤(方形)選中後的樣式：改為實心色塊 */
:deep(.rounded-lg.v-chip--selected) {
  background-color: currentColor !important;
  color: white !important;
}

/* 懸停小動畫 */
:deep(.v-chip) {
  transition: all 0.2s ease-in-out !important;
}
:deep(.v-chip:hover) {
  transform: translateY(-2px); /* 向上微浮，更有點擊感 */
}
</style>
