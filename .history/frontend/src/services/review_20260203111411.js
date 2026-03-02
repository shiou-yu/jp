import axiosAPI from '@/plugins/axios'

const api = `${import.meta.env.VITE_API_URL}/review`

// 取得所有評論（管理員）
export const getAllReviews = () => {
  return axiosAPI.get(`${api}/all`)
}

// 審核評論
export const approveReview = (id) => {
  return axiosAPI.patch(`${api}/${id}/approve`)
}

// 更新評論狀態
export const updateReviewStatus = (id, status) => {
  return axiosAPI.patch(`${api}/${id}/status`, { status })
}

// 刪除評論
export const deleteReview = (id) => {
  return axiosAPI.delete(`${api}/${id}`)
}

// 建立評論
export const createReview = (data) => {
  return axiosAPI.post(api, data)
}

// 取得商品評論
export const getProductReviews = (productId) => {
  return axiosAPI.get(`${api}/product/${productId}`)
}

// 取得我的評論
export const getMyReviews = () => {
  return axiosAPI.get(`${api}/me`)
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

