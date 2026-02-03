console.log('✅ Review Controller 開始載入...')
import Review from '../models/reviews.js'
import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

// 建立評論
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body

    // 檢查商品是否存在
    const productExists = await Product.findById(product)
    if (!productExists) {
      throw new Error('商品不存在')
    }

    // 檢查使用者是否已評論過該商品
    const existingReview = await Review.findOne({
      user: req.user._id,
      product,
    })
    if (existingReview) {
      throw new Error('您已經評論過此商品')
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '評論建立成功',
      result: review,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || '未知錯誤',
      })
    }
  }
}

// 取得所有評論（管理員）
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'account')
      .populate('product', 'name image category')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: reviews,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤',
    })
  }
}

// 取得單一商品的評論
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.id,
      status: '已審核',
    })
      .populate('user', 'account')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: reviews,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤',
    })
  }
}

// 取得我的評論
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name image category')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: reviews,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤',
    })
  }
}

// 審核評論（管理員）
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: '已審核' },
      { new: true },
    )
      .populate('user', 'account')
      .populate('product', 'name image category')

    if (!review) {
      throw new Error('找不到評論')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '評論已審核',
      result: review,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || '未知錯誤',
    })
  }
}

// 刪除評論（管理員）
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) {
      throw new Error('找不到評論')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '評論已刪除',
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || '未知錯誤',
    })
  }
}

// 更新評論狀態（管理員）
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    )
      .populate('user', 'account')
      .populate('product', 'name image category')

    if (!review) {
      throw new Error('找不到評論')
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: '評論狀態已更新',
      result: review,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || '未知錯誤',
    })
  }
}

// 編輯評論（使用者）
export const editReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!review) {
      throw new Error('找不到評論或無權限編輯')
    }

    review.rating = rating
    review.comment = comment
    review.status = '待審核' // 編輯後需重新審核
    await review.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '評論已更新',
      result: review,
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || '未知錯誤',
      })
    }
  }
}
