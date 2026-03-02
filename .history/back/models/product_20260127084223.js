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
    // ✨ 新增這段：儲存評論總數的欄位
    reviewCount: {
      type: Number,
      default: 0, // 初始值為 0
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

schema.virtual('imageUrl').get(function () {
  const product = this
  return cloudinary.url(product.image)
})

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

export default model('products', schema)

