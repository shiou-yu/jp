import User from '../models/user.js'
import Product from '../models/product.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import validator from 'validator'

export const create = async (req, res) => {
  try {
    const result = new User(req.body)
    await result.save()
    res.status(StatusCodes.CREATED).json({
      result: {},
    })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        message,
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        message: '帳號重複',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}

export const login = async (req, res) => {
  try {
    // 簽發 jwt
    // jwt.sign(攜帶資料, 驗證用secret, 設定)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 將簽發的 token 存入使用者
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {
        account: req.user.account,
        role: req.user.role,
        cart: req.user.cart.length,
        token,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const profile = (req, res) => {
  res.status(StatusCodes.OK).json({
    result: {
      account: req.user.account,
      role: req.user.role,
      cart: req.user.cart.length,
    },
  })
}

export const refresh = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[i] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {
        token,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const logout = async (req, res) => {
  try {
    const i = req.user.tokens.indexOf(req.token)
    req.user.tokens.splice(i, 1)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      result: {},
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}

export const cart = async (req, res) => {
  try {
    // 驗證要放入購物車的商品 ID 格式
    if (!validator.isMongoId(req.body.product)) {
      throw new Error('PRODUCT ID')
    }

    // 檢查商品是否存在
    await Product.findById(req.body.product).orFail(new Error('PRODUCT ID'))

    // 檢查購物車有沒有指定商品
    const i = req.user.cart.findIndex((item) => item.product.toString() === req.body.product)

    if (i > -1) {
      // 處理已經在購物車的商品
      // 如果 replace 是 true，就替換掉數量
      // 如果 replace 是 false，就增加數量
      if (req.body.replace) {
        req.user.cart[i].quantity = req.body.quantity
      } else {
        req.user.cart[i].quantity += req.body.quantity
      }

      // 檢查數量，如果 <= 0，從購物車刪除
      if (req.user.cart[i].quantity <= 0) {
        req.user.cart.splice(i, 1)
      }
    } else if (req.body.quantity > 0) {
      // 不在購物車，且數量 > 0，新增商品
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity,
      })
    }

    await req.user.save()

    res.status(StatusCodes.OK).json({
      result: req.user.cart.length,
    })
  } catch (error) {
    if (error.message === 'PRODUCT ID') {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '商品不存在',
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: '伺服器錯誤',
      })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, 'cart').populate('cart.product')

    // 自動清理無效收藏（product 為 null 的項目）
    const validCart = user.cart.filter((item) => item.product !== null)

    // 如果有無效項目，更新資料庫
    if (validCart.length !== user.cart.length) {
      console.log(`清理了 ${user.cart.length - validCart.length} 個無效收藏`)
      await User.findByIdAndUpdate(req.user._id, { cart: validCart })
    }

    res.status(StatusCodes.OK).json({
      result: validCart,
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '伺服器錯誤',
    })
  }
}
