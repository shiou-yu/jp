import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'
import reviews from '../models/reviews.js' 
import Product from '../models/product.js' // ✨ 確保匯入商品 Model 以更新計數

const router = Router()

// --- 原有的商品管理路由 ---
router.post('/', auth.token, auth.admin, upload, product.create)
router.get('/', product.get)
router.get('/all', auth.token, auth.admin, product.getAll)

// --- 評論相關路由 ---

// 1. 取得某商品的評論
router.get('/:id/rating', async (req, res) => {
  try {
    const result = await reviews
      .find({ product: req.params.id })
      .populate('user', 'account')
      .sort({ date: -1 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '伺服器錯誤' })
  }
})

// 2. 新增評論 (整合同步更新商品計數邏輯)
router.post('/:id/rating', auth.token, async (req, res) => {
  try {
    // A. 建立評論
    const result = await reviews.create({
      product: req.params.id,
      user: req.user._id, 
      rating: req.body.rating,
      comment: req.body.comment,
    })

    // B. ✨ 關鍵修正：讓 Product 裡的 reviewCount 自動 +1
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { reviewCount: 1 }
    })

    res.status(200).json({ success: true, message: '評論成功', result })
  } catch (error) {
    console.error('評論更新錯誤:', error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: '資料格式錯誤' })
    } else {
      res.status(500).json({ success: false, message: '伺服器錯誤' })
    }
  }
})

// --- 原有的單一商品路由 ---
router.get('/:id', product.getId)
router.patch('/:id', auth.token, auth.admin, upload, product.update)

export default router