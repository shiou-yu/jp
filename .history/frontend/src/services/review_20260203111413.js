import { apiAuth } from '@/plugins/axios'  // 👈 改這行

const api = `${import.meta.env.VITE_API_URL}/review`

// 取得所有評論（管理員）
export const getAllReviews = () => {
  return apiAuth.get(`${api}/all`)  // 👈 改成 apiAuth
}

// 審核評論
export const approveReview = (id) => {
  return apiAuth.patch(`${api}/${id}/approve`)  // 👈 改成 apiAuth
}

// 更新評論狀態
export const updateReviewStatus = (id, status) => {
  return apiAuth.patch(`${api}/${id}/status`, { status })  // 👈 改成 apiAuth
}

// 刪除評論
export const deleteReview = (id) => {
  return apiAuth.delete(`${api}/${id}`)  // 👈 改成 apiAuth
}

// 建立評論
export const createReview = (data) => {
  return apiAuth.post(api, data)  // 👈 改成 apiAuth
}

// 取得商品評論
export const getProductReviews = (productId) => {
  return apiAuth.get(`${api}/product/${productId}`)  // 👈 改成 apiAuth
}

// 取得我的評論
export const getMyReviews = () => {
  return apiAuth.get(`${api}/me`)  // 👈 改成 apiAuth
}

export default {
  getAllReviews,
  approveReview,
  updateReviewStatus,
  deleteReview,
  createReview,
  getProductReviews,
  getMyReviews,
}
