<template>
  <v-container class="py-10">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-carousel
          cycle
          height="300"
          hide-delimiter-background
          show-arrows="hover"
          class="rounded-xl shadow-lg"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
            :src="slide.src"
            cover
          >
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold text-brown-darken-3">
          <v-icon class="mr-2" icon="mdi-store"></v-icon>
          精選商品
        </h1>
        <p class="text-grey mt-2">探索我們為您精心挑選的日本好物</p>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          clearable
          color="amber-darken-2"
          hide-details
          label="搜尋商品名稱"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @click:clear="onClearSearch"
          @keydown.enter="fetchProducts"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex align-center flex-wrap" cols="12" md="8">
        <v-chip-group v-model="category" color="amber-darken-3" mandatory @update:model-value="fetchProducts">
          <v-chip filter value="全部" variant="outlined">全部</v-chip>
          <v-chip
            v-for="c in ['甜點', '零食', '熟食', '冰品', '泡麵']"
            :key="c"
            filter
            :value="c"
            variant="outlined"
          >{{ c }}</v-chip>
        </v-chip-group>
        <v-divider class="mx-4 d-none d-md-block" vertical></v-divider>
        <v-chip-group v-model="store" color="blue-darken-2" @update:model-value="fetchProducts">
          <v-chip
            v-for="s in ['7-11',
