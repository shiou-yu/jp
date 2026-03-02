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
    price: 246,
    description:
      '香酥的餅乾以黑麥、燕麥、裸麥等七種不同穀物製作而成，再塗上奶油與砂糖更增添口感層次，再加入濃醇奶香的白巧克力，入口感受香氣撲鼻的麥香與巧克力的香甜滋味，甜而不膩口，多層次的獨特口感，越嚼越香!',
    store: '7-11',
    category: '零食',
    sell: true,
    image: '711_french_toast_bymvxx',
  },
  {
    name: '日清 中本蒙古 辣泡麵旨味噌拉麵',
    price: 448,
    description:
      '重現著名餐廳「蒙古中本」的超辣拉麵的正宗杯麵。 我們改進了麵條，使麵條變得更粗，吃起來更飽滿，更貼近餐廳的氛圍。 使用豐富的食材，忠實再現中本萌子擔面的味道的辣湯。',
    store: '7-11',
    category: '泡麵',
    sell: true,
    image: '711_miso_ramen_rwejpp',
  },
  {
    name: '7-11 赤飯糰',
    price: 170,
    description:
      '這款飯糰是用軟糯有嚼勁的紅米在竹蒸籠中蒸熟製成的，上面放有甜紅豆，是北海道的一道常見菜餚。',
    store: '7-11',
    category: '熟食',
    sell: true,
    image: '711_strawberry_choco_zr7gl6',
  },
  {
    name: '7-11 生巧克力冰淇淋',
    price: 289,
    description:
      '濃厚的巧克力冰淇淋上面，灑上滿滿的生巧克力磚，每一口都吃得到入口即化的冰淇淋與生巧克力磚在嘴中化開，濃上加濃的口感，身為巧克力粉一定會瘋掉！',
    store: '7-11',
    category: '冰品',
    sell: true,
    image: '711_cho_mxuist',
  },
  {
    name: '7-11 明治超級杯冰淇淋 紅茶餅乾口味',
    price: 180,
    description: '濃郁的大吉嶺茶香，加上藏在冰淇淋內的紅茶餅乾脆片，讓整體茶香超濃、口感多層次',
    store: '7-11',
    category: '冰品',
    sell: true,
    image: '711_miji_spyhav',
  },
  // --- 全家 (FamilyMart) 系列 ---
  {
    name: '全家 舒芙蕾布丁 (限定版)',
    price: 278,
    description: '季節限定口味！綿密的舒芙蕾搭配底層香醇布丁，口感層次豐富。',
    store: '全家',
    category: '甜點',
    sell: true,
    image: 'fm_pudding_jsvanp',
  },
  {
    name: '全家 背脂大蒜月見肉包',
    price: 195,
    description:
      '使用大蒜與豬油、醬油炒香的肉末內餡，再加入大量蛋黃風醬，吃起來鹹香鹹香，還有蛋黃醬增加濕潤濃厚的口感，絕對是視覺、味覺雙享受！',
    store: '全家',
    category: '熟食',
    sell: true,
    image: 'fm_lava_cake_ihtg4n',
  },
  {
    name: '全家 多樂福水果糖口味冰棒',
    price: 184,
    description:
      '綜合水果口味冰棒外層用白色巧克力包裹，再加入7種多樂福水果糖糖碎，吃起來又冰又脆，充滿復古的兒時滋味！',
    store: '全家',
    category: '冰品',
    sell: true,
    image: 'fm_ice_rjqoct',
  },
  {
    name: '烤起司蛋糕',
    price: 440,
    description: '這是一款迷你尺寸的烤起司蛋糕，非常適合分享。',
    store: '全家',
    category: '甜點',
    sell: true,
    image: 'so_ice_vanilla_qwewl3',
  },
  {
    name: '瑪格麗特披薩三明治配熟透的番茄',
    price: 298,
    description: '這種有嚼勁的麵團在低溫下長時間發酵，然後包裹上成熟的番茄醬和融化的馬蘇里拉起司。',
    store: '全家',
    category: '熟食',
    sell: true,
    image: 'vanilla_yioef6',
  },
  {
    name: 'Newtouch 橫濱家系豚骨醬油風味拉麵',
    price: 350,
    description: '濃郁豚骨醬油湯頭搭配Q彈拉麵，在家也能輕鬆享受橫濱道地風味。',
    store: '全家',
    category: '泡麵',
    sell: true,
    image: 'yioef6_nmaplv',
  },
  {
    name: '全家獨家水果酒SUPER CHU-HI',
    price: 200,
    description:
      '一方面保留了水果的清甜滋味，一方面實現不易膩的俐落口感，充分將柑橘類水果的特徵反映於酒飲中。目前共有檸檬、葡萄柚、無糖檸檬這3種口味，搭配5%與7%的酒精濃度和350ml與500ml的容量，無酒不歡的你一定要喝喝看！',
    store: '全家',
    category: '零食',
    sell: true,
    image: 'SUPER_CHU-HI_ff5klz',
  },
  // --- Lawson 系列 ---
  {
    name: 'Lawson 炸雞君',
    price: 259,
    description: '經典炸雞君，微辣鮮香，一口接一口停不下來。',
    store: 'Lawson',
    category: '熟食',
    sell: true,
    image: 'lawson_karaage_mentai_shacep',
  },
  {
    name: '明太子卡邦尼義大利麵',
    price: 599,
    description: '濃鬱的醬汁和明太子的味道令人上癮！起司粉和黑胡椒則增添了恰到好處的風味。',
    store: 'Lawson',
    category: '熟食',
    sell: true,
    image: 'cheese_cake_ejooqw',
  },
  {
    name: 'Lawson 奶油乳酪煙燻鮭魚捲',
    price: 599,
    description: '盡情享受煙燻鮭魚和奶油乳酪的美味。',
    store: 'Lawson',
    category: '零食',
    sell: true,
    image: '1769664341480_m75gy2',
  },
  {
    name: 'Lawson 激辛暴君哈瓦那辣椒餅乾',
    price: 108,
    description: '灑滿帶強勁嗆辣味的唐辛子粉，雙重辣味刺激讓人直呼過癮！',
    store: 'Lawson',
    category: '零食',
    sell: true,
    image: 'soy_frfele',
  },
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
    name: '【明星 × 東京設計專門學校聯名款】三重蔥香雞鹽拉麵～蔥味最強的限定泡麵！',
    price: 300,
    description: '明星食品聯手東京設計專門學校推出的【三重蔥香雞鹽拉麵】，日文名稱是「ねぎらー 鶏塩ラーメン」，簡直就是蔥控的天堂！',
    store: 'Lawson',
    category: '泡麵',
    sell: true,
    image: '
calbee_b5him5',
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
