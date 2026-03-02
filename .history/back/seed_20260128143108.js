import 'dotenv/config' // 1. 自動讀取 .env 檔案中的設定
import mongoose from 'mongoose'
import Product from './models/product.js' // ⚠️ 請確認你的 Model 檔名是 product.js

// 2. 直接從 process.env 抓取連線資訊
const mongoURI = process.env.DB_URL

const products = [
  // --- 7-11 系列 ---
  {
    name: '7-11 香甜成熟的草莓冰棒',
    price: 192,
    description:
      '這是來自人氣「丸手」系列的甜美成熟的草莓味冰棒，其口感和果香讓人感覺就像在吃冷凍水果',
    store: '7-11',
    category: '冰品',
    sell: true,
    image: '711_daifuku_nc9kby',
  },
  {
    name: '7-11 砂糖奶油樹白巧克力夾心脆餅',
    price: 181,
    description: '厚片吐司吸飽蛋液，中間夾入濃郁生巧克力，微波後口感更棒。',
    store: '7-11',
    category: '甜點',
    sell: true,
    image: 'products/711_french_toast',
  },
  {
    name: '7-11 濃厚味噌拉麵',
    price: 298,
    description: '與北海道名店聯名，湯頭濃郁帶有焦糖香氣，是宵夜的夢幻逸品。',
    store: '7-11',
    category: '泡麵',
    sell: true,
    image: 'products/711_miso_ramen',
  },
  {
    name: '7-11 凍乾草莓巧克力',
    price: 324,
    description: '整顆乾燥草莓包覆在白巧克力中，酸甜交織，是辦公室熱門零食。',
    store: '7-11',
    category: '零食',
    sell: true,
    image: 'products/711_strawberry_choco',
  },
  // --- 全家 (FamilyMart) 系列 ---
  {
    name: '全家 舒芙蕾布丁 (限定版)',
    price: 350,
    description: '季節限定口味！綿密的舒芙蕾搭配底層香醇布丁，口感層次豐富。',
    store: '全家',
    category: '甜點',
    sell: true,
    image: 'products/fm_pudding',
  },
  {
    name: '全家 熔岩巧克力塔',
    price: 240,
    description: '內餡使用 50% 以上的可可，切開後巧克力漿會緩緩流出。',
    store: '全家',
    category: '甜點',
    sell: true,
    image: 'products/fm_lava_cake',
  },
  {
    name: '全家 旨辛炸雞腿排',
    price: 230,
    description: '全家炸雞系列的辛辣版，外皮香脆多汁，是配啤酒的最佳夥伴。',
    store: '全家',
    category: '熟食',
    sell: true,
    image: 'products/fm_spicy_chicken',
  },
  {
    name: '爽 ICE 濃醇香草',
    price: 172,
    description: '獨特的細碎冰結構，口感介於冰淇淋與雪泥之間，清爽不膩。',
    store: '全家',
    category: '冰品',
    sell: true,
    image: 'products/so_ice_vanilla',
  },
  // --- Lawson 系列 ---
  {
    name: 'Lawson 炸雞君 (明太子口味)',
    price: 259,
    description: '經典炸雞君結合明太子，微辣鮮香，一口接一口停不下來。',
    store: 'Lawson',
    category: '熟食',
    sell: true,
    image: 'products/lawson_karaage_mentai',
  },
  {
    name: 'Lawson Uchi Café 起司蛋糕',
    price: 257,
    description: '使用三種不同的起司調配而成，口感細緻如絲綢，入口即化。',
    store: 'Lawson',
    category: '甜點',
    sell: true,
    image: 'products/lawson_cheese_cake',
  },
  {
    name: 'Lawson 脆皮抹茶冰淇淋大福',
    price: 224,
    description: '使用宇治抹茶製作的濃郁內餡，外皮軟糯，抹茶控必試。',
    store: 'Lawson',
    category: '冰品',
    sell: true,
    image: 'products/lawson_matcha_mochi',
  },
  {
    name: 'Lawson 醬油糰子',
    price: 108,
    description: '經典的日式庶民甜點，軟 Q 糰子淋上甜鹹適中的特製醬油膏。',
    store: 'Lawson',
    category: '甜點',
    sell: true,
    image: 'products/dango_soy_sauce',
  },
  // --- 熱門商品補充 ---
  {
    name: '日清 謎肉祭杯麵',
    price: 245,
    description: '日清 50 週年限定，放入 4 倍份量的乾燥肉塊，湯頭極度鮮美。',
    store: '7-11',
    category: '泡麵',
    sell: true,
    image: 'products/nissin_meat_festival',
  },
  {
    name: '卡樂比 堅脆洋芋片',
    price: 168,
    description: '口感偏硬且脆度極高，搭配九州特有的甜醬油味，越嚼越香。',
    store: '7-11',
    category: '零食',
    sell: true,
    image: 'products/calbee_kyushu_soy',
  },
]

const importData = async () => {
  console.log('--- 腳本啟動中 ---')
  try {
    if (!mongoURI) {
      throw new Error('找不到 DB_URL，請檢查 .env 檔案')
    }

    console.log('正在嘗試連線 MongoDB...')
    await mongoose.connect(mongoURI)
    console.log('✅ MongoDB 連線成功')

    // 建議先清空再匯入，避免商品重複
    const deleteResult = await Product.deleteMany({})
    console.log(`🗑️ 已清空舊商品 (共 ${deleteResult.deletedCount} 筆)`)

    await Product.insertMany(products)
    console.log(`📦 成功匯入 ${products.length} 項新商品！`)
  } catch (error) {
    console.error('❌ 執行失敗：', error.message)
  } finally {
    console.log('正在關閉連線...')
    await mongoose.connection.close()
    console.log('--- 腳本結束 ---')
    process.exit()
  }
}

// 執行啟動
importData()
