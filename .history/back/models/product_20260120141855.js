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
    // --- 新增這段：超商欄位 (限定三家) ---
    store: {
      type: String,
      required: [true, '販售超商必填'],
      enum: {
        values: ['7-11', '全家', 'Lawson'], // 這裡鎖定只能填這三個值
        message: '超商名稱無效，只能是 7-11, 全家, 或 Lawson',
      },
    },
    // ----------------------------------
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

// ★ 建議加碼：在這裡順便把「超商代表色」做成虛擬欄位
// 這樣前端就不用自己寫 switch 判斷顏色，直接讀 product.storeColor 就可以
schema.virtual('storeColor').get(function () {
  switch (this.store) {
    case '7-11':
      return '#F58220' // 橘色
    case '全家':
      return '#009944' // 綠色
    case 'Lawson':
      return '#006CB7' // 藍色
    default:
      return '#808080' // 灰色
  }
})

export default model('products', schema)
