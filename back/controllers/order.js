import Order from '../models/order.js'
import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'

export const create = async (req, res) => {
  try {
    // 檢查購物車有沒有東西
    if (req.user.cart.length === 0) {
      throw new Error('EMPTY')
    }

    // 檢查有沒有下架商品
    const products = await Product.find({
      _id: { $in: req.user.cart.map((item) => item.product) },
      sell: false,
    })
    if (products.length > 0) {
      throw new Error('SELL')
    }

    // 建立訂單
    const result = await Order.create({
      user: req.user._id,
      cart: req.user.cart,
    })

    // 清空使用者的購物車
    req.user.cart = []
    await req.user.save()

    res.status(StatusCodes.CREATED).json({
      result: {
        _id: result._id,
        createdAt: result.createdAt,
      },
    })
  } catch (error) {
    if (error.message === 'EMPTY') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '購物車是空的',
      })
    } else if (error.message === 'SELL') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '包含未上架商品',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}

export const get = async (req, res) => {
  try {
    const result = await Order.find({ user: req.user._id }, '-user')
      .populate('cart.product')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      result,
    })
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const result = await Order.find()
      .populate('cart.product')
      .populate('user', 'account')
      .sort({ createdAt: -1 })

    res.status(StatusCodes.OK).json({
      result,
    })
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}
