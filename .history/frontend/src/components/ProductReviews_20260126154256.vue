<template>
  <v-container class="py-10" v-if="product">
    <v-row>
      <v-col cols="12" md="6">
        <v-img
          :src="imageUrl"
          class="rounded-xl elevation-2"
          cover
          height="450"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
              <v-progress-circular indeterminate color="grey-lighten-2"></v-progress-circular>
            </div>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="6" class="pl-md-10">
        <v-chip color="blue-grey-lighten-2" class="mb-2" variant="flat" size="small">
          {{ product.category }}
        </v-chip>

        <h1 class="text-h4 font-weight-bold text-blue-grey-darken-3 mb-4">
          {{ product.name }}
        </h1>

        <div class="d-flex align-center mb-6">
          <v-rating
            :model-value="product.rating"
            color="amber"
            density="compact"
            readonly
            half-increments
          ></v-rating>
          <span class="text-grey ml-2">({{ product.reviewCount || 0 }} 則評論)</span>
        </div>

        <p class="text-h5 text-orange-darken-3 font-weight-bold mb-6">
          {{ formatedPrice }}
        </p>

        <v-divider class="mb-6"></v-divider>

        <p class="text-blue-grey-darken-1 mb-10" style="line-height: 1.8; font-size: 1.1rem;">
          {{ product.description }}
        </p>

        <v-btn
          color="pink-lighten-2"
          size="x-large"
          prepend-icon="mdi-heart"
          @click="addFavorite"
          block
          rounded="lg"
          elevation="2"
        >
          加入收藏清單
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-10">
       </v-row>
  </v-container>
</template>
