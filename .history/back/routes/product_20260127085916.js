import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as product from '../controllers/product.js'
import upload from '../middlewares/upload.js'

const router = Router()

// --- 1. 商品管理路由 (新增、列表) ---
router.post('/', auth.token, auth.admin, upload, product.create)
router.get('/', product.get)
router.get('/all', auth.token, auth.admin, product.getAll)

// --- 2. 評論路由 (關鍵修正) ---

// ★★★ 修正點 A：路徑改成 '/review' (配合前端) ★★★
// ★★★ 修正點 B：直接使用 Controller 寫好的 createRating，不要在這裡寫邏輯 ★★★
router.post('/:id/review', auth.token, product.createRating)

// (這行通常用不到，因為 getId 已經幫你抓好評論了，如果不需要可以刪除)
// router.get('/:id/rating', product.getRatings)

// --- 3. 單一商品路由 (詳情、更新) ---
router.get('/:id', product.getId)
router.patch('/:id', auth.token, auth.admin, upload, product.update)

export default router