import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as reviewController from '../controllers/reviews.js'

const router = Router()

// 使用者路由（把 auth.jwt 全部改成 auth.token）
router.post('/', auth.token, reviewController.createReview) // 👈 改這裡
router.get('/me', auth.token, reviewController.getMyReviews) // 👈 改這裡
router.get('/product/:id', reviewController.getProductReviews)
router.patch('/:id', auth.token, reviewController.editReview) // 👈 改這裡

// 管理員路由
router.get('/all', auth.token, auth.admin, reviewController.getAllReviews) // 👈 改這裡
router.patch('/:id/approve', auth.token, auth.admin, reviewController.approveReview) // 👈 改這裡
router.patch('/:id/status', auth.token, auth.admin, reviewController.updateReviewStatus) // 👈 改這裡
router.delete('/:id', auth.token, auth.admin, reviewController.deleteReview) // 👈 改這裡

export default router
