const products = [
  // --- 7-11 獨家限定 ---
  {
    name: "7-11 巧克力夾心法式吐司",
    price: 181,
    description: "厚片吐司吸飽蛋液，中間夾入濃郁生巧克力，微波後口感更棒。",
    store: "7-11",
    category: "甜點",
    sell: true,
    image: "products/711_french_toast"
  },
  {
    name: "7-11 濃厚味噌拉麵 (名店聯名)",
    price: 298,
    description: "與北海道名店聯名，湯頭濃郁帶有焦糖香氣，是宵夜的夢幻逸品。",
    store: "7-11",
    category: "泡麵",
    sell: true,
    image: "products/711_miso_ramen"
  },
  {
    name: "7-11 凍乾草莓巧克力",
    price: 324,
    description: "整顆乾燥草莓包覆在白巧克力中，酸甜交織，是辦公室熱門零食。",
    store: "7-11",
    category: "零食",
    sell: true,
    image: "products/711_strawberry_choco"
  },
  // --- 全家 (FamilyMart) 必買 ---
  {
    name: "全家 熔岩巧克力塔",
    price: 240,
    description: "內餡使用 50% 以上的可可，切開後巧克力漿會緩緩流出，視覺感十足。",
    store: "全家",
    category: "甜點",
    sell: true,
    image: "products/fm_lava_cake"
  },
  {
    name: "全家 旨辛炸雞腿排",
    price: 230,
    description: "全家炸雞系列的辛辣版，外皮香脆多汁，是配啤酒的最佳夥伴。",
    store: "全家",
    category: "熟食",
    sell: true,
    image: "products/fm_spicy_chicken"
  },
  {
    name: "全家 咖啡凍聖代",
    price: 298,
    description: "底層是苦甜咖啡凍，上方是濃郁鮮奶油與焦糖醬，層次分明。",
    store: "全家",
    category: "甜點",
    sell: true,
    image: "products/fm_coffee_jelly"
  },
  {
    name: "全家 起司玉米濃湯麵包",
    price: 158,
    description: "將濃郁的玉米濃湯灌入麵包中心，再灑上大量起司烘烤而成。",
    store: "全家",
    category: "零食",
    sell: true,
    image: "products/fm_corn_bread"
  },
  // --- Lawson 甜點王國 ---
  {
    name: "Lawson Uchi Café 濃厚起司蛋糕",
    price: 257,
    description: "使用三種不同的起司調配而成，口感細緻如絲綢，入口即化。",
    store: "Lawson",
    category: "甜點",
    sell: true,
    image: "products/lawson_cheese_cake"
  },
  {
    name: "Lawson 脆皮抹茶冰淇淋大福",
    price: 224,
    description: "使用宇治抹茶製作的濃郁內餡，外皮軟糯，冰品愛好者必試。",
    store: "Lawson",
    category: "冰品",
    sell: true,
    image: "products/lawson_matcha_mochi"
  },
  {
    name: "Lawson 厚切豬排三明治",
    price: 430,
    description: "軟嫩的豬排搭配酸甜醬汁與柔軟麵包，這就是日本超商的飽足感。",
    store: "Lawson",
    category: "熟食",
    sell: true,
    image: "products/lawson_pork_sandwich"
  },
  {
    name: "Lawson 雞肉明太子起司捲",
    price: 298,
    description: "冷熱食皆宜！鮮嫩雞胸肉捲入滿滿的明太子與起司，口感紮實。",
    store: "Lawson",
    category: "熟食",
    sell: true,
    image: "products/lawson_chicken_roll"
  },
  // --- 泡麵與特色零食 ---
  {
    name: "日清 謎肉祭杯麵",
    price: 245,
    description: "日清 50 週年限定，放入 4 倍份量的乾燥肉塊，湯頭極度鮮美。",
    store: "7-11",
    category: "泡麵",
    sell: true,
    image: "products/nissin_meat_festival"
  },
  {
    name: "卡樂比 堅脆洋芋片 (九州醬油)",
    price: 168,
    description: "口感偏硬且脆度極高，搭配九州特有的甜醬油味，越嚼越香。",
    store: "7-11",
    category: "零食",
    sell: true,
    image: "products/calbee_kyushu_soy"
  },
  {
    name: "爽 ICE 濃醇香草 (期間限定版)",
    price: 172,
    description: "獨特的細碎冰結構，口感介於冰淇淋與雪泥之間，清爽不膩。",
    store: "全家",
    category: "冰品",
    sell: true,
    image: "products/so_ice_vanilla"
  },
  {
    name: "醬油糰子 (三入裝)",
    price: 108,
    description: "經典的日式庶民甜點，軟 Q 糰子淋上甜鹹適中的特製醬油膏。",
    store: "Lawson",
    category: "甜點",
    sell: true,
    image: "products/dango_soy_sauce"
  }
];