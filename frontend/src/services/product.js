import { useApi } from '@/composables/api'

const { api, apiAuth } = useApi()

export default {
  create: (data) => {
    return apiAuth.post('/product', data)
  },
  getAll: () => {
    return apiAuth.get('/product/all')
  },
  update: (id, data) => {
    return apiAuth.patch(`/product/${id}`, data)
  },
  get: () => {
    return api.get('/product')
  },
  getId: (id) => {
    return api.get(`/product/${id}`)
  },
}
