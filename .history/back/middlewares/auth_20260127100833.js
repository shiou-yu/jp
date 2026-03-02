import passport from 'passport'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      if (error?.message === 'USER' || info?.message === 'Missing credentials') {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: '帳號或密碼錯誤',
        })
      } else {
        // 🔥 加上 Log
        console.error('Login Error:', error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
      }
    } else {
      req.user = user
      next()
    }
  })(req, res, next)
}

export const token = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 判斷是否為預期的驗證錯誤
      if (
        info instanceof jwt.JsonWebTokenError ||
        error?.message === 'EXP' ||
        error?.message === 'USER'
      ) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: '身分驗證失敗',
        })
      } else {
        // 🔥🔥🔥 關鍵修改：把未知的錯誤印出來！ 🔥🔥🔥
        console.error('--------------------------------')
        console.error('❌ Passport JWT 發生未知錯誤')
        console.error('Error:', error)
        console.error('Info:', info)
        console.error('--------------------------------')
        
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: '伺服器錯誤',
        })
      }
    } else {
      req.user = data.user
      req.token = data.token
      next()
    }
  })(req, res, next)
}

export const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(StatusCodes.FORBIDDEN).json({
      message: '無權限',
    })
  } else {
    next()
  }
}