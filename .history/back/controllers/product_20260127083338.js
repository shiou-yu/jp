import Product from '../models/product.js'
import Review from '../models/reviews.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'
import cloudinary from '../cloudinary/cloudinary.js'

// --- ✨ 整合後的 get 函式 (支援模糊搜尋、類別、超商篩選) ---
export const get = async (req, res) => {
  try {
    // 1. 基礎查詢：只找上架中的商品
    const query = { sell: true }

    // 2. 處理文字搜尋 (名稱 或 說明 模糊搜尋)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i')
      // 使用 $or 讓搜尋同時比對 name 與 description 欄位
      query.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ]
    }

    // 3. 處理類別篩選 (若前端傳「全部」則不加入篩選條件)
    if (req.query.category && req.query.category !== '全部') {
      query.category = req.query.category
    }

    // 4. 處理超商篩選 (7-11, 全家, Lawson)
    if (req.query.store) {
      query.store = req.query.store
    }

    // 執行查詢並按建立時間排序 (最新的排前面)
    const result = await Product.find(query).sort({ createdAt: -1 })
    
    res.status(StatusCodes.OK).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '伺服器錯誤' })
  }
}

// --- 取得所有商品 (管理頁面使用) ---
export const getAll = async (req, res) => {
  try {
    const result = await Product.find()
    res.status(StatusCodes.OK).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '伺服器錯誤' })
  }
}

// --- 取得單一商品詳情 ---
export const getId = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Product.findById(req.params.id).orFail(new Error('ID'))
    res.status(StatusCodes.OK).json({ success: true, message: '', result })
  } catch (error) {
    if (error.message === 'ID') {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, message: '找不到商品' })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '伺服器錯誤' })
    }
  }
}

// --- 建立評論並同步更新商品評論計數 ---
export const createRating = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    })

    // 使用 $inc 原子性操作增加評論數
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { reviewCount: 1 },
    }).orFail(new Error('ID'))

    res.status(StatusCodes.OK).json({ success: true, message: '評論成功', result: review })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '伺服器錯誤' })
  }
}

// --- 取得該商品的所有評論 ---
export const getRatings = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Review.find({ product: req.params.id }).populate('user', 'account')
    res.status(StatusCodes.OK).json({ success: true, result })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '取得評論失敗' })
  }
}

// --- 商品新增 (含圖片上傳) ---
export const create = async (req, res) => {
  try {
    const result = new Product({ ...req.body, image: req.file.filename })
    await result.save()
    res.status(StatusCodes.CREATED).json({ success: true, message: '', result })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: '建立失敗' })
  }
}

// --- 商品更新 (含 Cloudinary 舊圖刪除) ---
export const update = async (req, res) => {
  try {
    if (!validator.isMongoId(req.params.id)) throw new Error('ID')
    const result = await Product.findById(req.params.id).orFail(new Error('ID'))
    
    if (req.file) {
      // 刪除 Cloudinary 上的舊圖片
      await cloudinary.uploader.destroy(result.image)
      result.image = req.file.filename
    }
    
    result.set(req.body)
    await result.save()
    res.status(StatusCodes.OK).json({ success: true, message: '', result })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: '更新失敗' })
  }
}
