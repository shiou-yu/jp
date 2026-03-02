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
          clearable
          color="blue-grey-darken-3"
          bg-color="white"
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          class="rounded-lg shadow-sm"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="blue-grey-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip
            filter value="全部" variant="flat"
            bg-color="grey-lighten-4"
            class="text-blue-grey-darken-3 font-weight-bold px-4 rounded-pill"
          >全部</v-chip>

          <v-chip filter value="甜點" variant="flat" bg-color="pink-lighten-5" class="text-pink-darken-2 font-weight-bold rounded-pill">甜點 🍰</v-chip>
          <v-chip filter value="零食" variant="flat" bg-color="orange-lighten-5" class="text-orange-darken-4 font-weight-bold rounded-pill">零食 🍪</v-chip>
          <v-chip filter value="熟食" variant="flat" bg-color="amber-lighten-5" class="text-brown-darken-2 font-weight-bold rounded-pill">熟食 🍱</v-chip>
          <v-chip filter value="冰品" variant="flat" bg-color="blue-lighten-5" class="text-blue-darken-4 font-weight-bold rounded-pill">冰品 🍦</v-chip>
          <v-chip filter value="泡麵" variant="flat" bg-color="red-lighten-5" class="text-red-darken-4 font-weight-bold rounded-pill">泡麵 🍜</v-chip>
        </v-chip-group>

        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>

        <v-chip-group v-model="store" @update:model-value="fetchProducts">
          <v-chip
            value="7-11" variant="outlined"
            color="deep-orange-darken-2"
            class="font-weight-black rounded-lg px-5"
            style="border-width: 2px;"
          >7-11</v-chip>

          <v-chip
            value="全家" variant="outlined"
            color="green-darken-2"
            class="font-weight-black rounded-lg px-5"
            style="border-width: 2px;"
          >全家</v-chip>

          <v-chip
            value="Lawson" variant="outlined"
            color="blue-darken-2"
            class="font-weight-black rounded-lg px-5"
            style="border-width: 2px;"
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
