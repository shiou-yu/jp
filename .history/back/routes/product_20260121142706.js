import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'
import reviews from '../models/reviews.js' // ★ 確保有匯入剛剛建立的 reviews model

const router = Router()

// --- 原有的商品管理路由 ---
router.post('/', auth.token, auth.admin, upload, product.create)
router.get('/', product.get)
router.get('/all', auth.token, auth.admin, product.getAll)

// --- ★ 新增：評論相關路由 (建議放在 /:id 之前) ---

// 1. 取得某商品的評論 (公開，不需驗證)
router.get('/:id/rating', async (req, res) => {
  try {
    const result = await reviews
      .find({ product: req.params.id })
      .populate('user', 'account avatar') // 關聯取出使用者的帳號與頭像(如果有的話)
      .sort({ date: -1 }) // 新的留言排前面
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '伺服器錯誤' })
  }
})

// 2. 新增評論 (需要登入 auth.token)
router.post('/:id/rating', auth.token, async (req, res) => {
  try {
    const result = await reviews.create({
      product: req.params.id,
      user: req.user._id, // 從 auth.token 解碼後的 user 取出 ID
      rating: req.body.rating,
      comment: req.body.comment,
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
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
