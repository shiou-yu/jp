import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import * as reviewController from '../controllers/review.js'

const router = Router()

// 使用者路由
router.post('/', auth.jwt, reviewController.createReview)
router.get('/me', auth.jwt, reviewController.getMyReviews)
router.get('/product/:id', reviewController.getProductReviews)
router.patch('/:id', auth.jwt, reviewController.editReview)

// 管理員路由
router.get('/all', auth.jwt, auth.admin, reviewController.getAllReviews)
router.patch('/:id/approve', auth.jwt, auth.admin, reviewController.approveReview)
router.patch('/:id/status', auth.jwt, auth.admin, reviewController.updateReviewStatus)
router.delete('/:id', auth.jwt, auth.admin, reviewController.deleteReview)

export default router