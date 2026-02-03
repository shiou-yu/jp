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
      min: [1, '評分最低為 1'],
      max: [5, '評分最高為 5'],
    },
    comment: {
      type: String,
      required: [true, '缺少評論內容'],
      minlength: [1, '評論內容最少 1 字'],
      maxlength: [150, '評論內容最多 150 字'],
    },
    status: {
      // 👈 新增狀態欄位
      type: String,
      enum: ['待審核', '已審核', '已隱藏'],
      default: '待審核',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true, // 👈 自動加入 createdAt 和 updatedAt
  },
)

export default mongoose.model('reviews', schema)
