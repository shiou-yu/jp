import { Schema, model } from 'mongoose'
import cloudinary from '../cloudinary/cloudinary.js'

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱必填'],
      minlength: [1, '商品名稱最少 1 個字'],
      maxlength: [100, '商品名稱最多 100 個字'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, '商品價格必填'],
      min: [0, '商品價格最少 0 元'],
    },
    description: {
      type: String,
      maxlength: [1000, '商品描述最多 1000 個字'],
      trim: true,
    },
    store: {
      type: String,
      required: [true, '販售超商必填'],
      enum: {
        values: ['7-11', '全家', 'Lawson'],
        message: '超商名稱無效，只能是 7-11, 全家, 或 Lawson',
      },
    },
    category: {
      type: String,
      required: [true, '商品類別必填'],
      enum: {
        values: ['甜點', '零食', '熟食', '冰品', '泡麵'],
        message: '商品類別無效',
      },
    },
    sell: {
      type: Boolean,
      default: true,
      required: [true, '商品狀態必填'],
    },
    image: {
      type: String,
      required: [true, '商品圖片必填'],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// 1. 圖片 URL 虛擬欄位
schema.virtual('imageUrl').get(function () {
  const product = this
  return cloudinary.url(product.image)
})

// 2. 超商顏色虛擬欄位
schema.virtual('storeColor').get(function () {
  switch (this.store) {
    case '7-11':
      return '#F58220'
    case '全家':
      return '#009944'
    case 'Lawson':
      return '#006CB7'
    default:
      return '#808080'
  }
})

// 3. 日圓價格虛擬欄位 (新整合)
schema.virtual('priceJP').get(function () {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(this.price)
})

// 4. 評論虛擬關聯
schema.virtual('reviews', {
  ref: 'reviews',
  localField: '_id',
  foreignField: 'product',
})

export default model('products', schema)
