import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.ObjectId,
      ref: 'products', // 關聯到商品集合
      required: [true, '缺少商品 ID'],
    },
    user: {
      type: mongoose.ObjectId,
      ref: 'users', // 關聯到使用者集合
      required: [true, '缺少使用者 ID'],
    },
    rating: {
      type: Number,
      required: [true, '缺少評分'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, '缺少評論內容'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
)

export default mongoose.model('reviews', schema)
