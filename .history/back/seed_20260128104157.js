import mongoose from 'mongoose'
import Product from './models/products.js' // ⬅️ 確保路徑正確

// 1. 連接你的資料庫 (請換成你自己的連線字串)
const mongoURI = 'mongodb://localhost:27017/你的資料庫名稱'

const products = [
  {
    name: "7-11 濃厚生巧克力大福",
    price: 172,
    description: "軟 Q 的大福外皮包裹著整顆生巧克力，苦甜平衡的極致享受。",
    store: "7-11",
    category: "甜點",
    sell: true,
    image: "products/711_daifuku" // 這是你在 Cloudinary 的圖片 ID
  },
  // ... 把我剛才給你的那 10 筆資料全部貼在這裡 ...
]

const importData = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('MongoDB 連線成功')

    // 先刪除舊商品 (選用，如果你想清空重新進貨的話)
    // await Product.deleteMany({}) 

    // 執行進貨
    await Product.insertMany(products)
    console.log('成功匯入商品！')
  } catch (error) {
    console.error('匯入失敗：', error)
  } finally {
    mongoose.connection.close()
  }
}

importData()