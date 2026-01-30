import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'

const router = Router()

// --- 1. 商品管理路由 ---
// 新增商品 (管理員)
router.post('/', auth.token, auth.admin, upload, product.create)

// 取得上架商品 (公開)
router.get('/', product.get)

// 取得所有商品 (管理員 - 必須放在 :id 路由之前！)
router.get('/all', auth.token, auth.admin, product.getAll)

// --- 2. 評論路由 ---
// 新增評論 (登入會員) - ★ 這裡已修正為 auth.token
router.post('/:id/review', auth.token, product.createRating)

// 取得該商品所有評論 (公開 - 如果你需要這個 API 的話)
router.get('/:id/reviews', product.getRatings)

// --- 3. 單一商品路由 ---
// 取得單一商品詳情 (必須放在 /all 之後)
router.get('/:id', product.getId)

// 更新商品 (管理員)
router.patch('/:id', auth.token, auth.admin, upload, product.update)

export default router
