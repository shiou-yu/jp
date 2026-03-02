import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'

const router = Router()

// --- 1. 商品管理路由 ---
// 這裡用 auth.token 沒報錯，代表它是對的
router.post('/', auth.token, auth.admin, upload, product.create)
router.get('/', product.get)
router.get('/all', auth.token, auth.admin, product.getAll)

// --- 2. 評論路由 ---

// ★★★ 修正：把 auth.jwt 改回 auth.token (跟上面保持一致) ★★★
router.post('/:id/review', auth.token, product.createRating)

// --- 3. 單一商品路由 ---
router.get('/:id', product.getId)
router.patch('/:id', auth.token, auth.admin, upload, product.update)

export default router