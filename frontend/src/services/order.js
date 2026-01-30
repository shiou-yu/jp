import { useApi } from '@/composables/api'

const { apiAuth } = useApi()

export default {
  create: () => {
    return apiAuth.post('/order')
  },
  get () {
    return apiAuth.get('/order')
  },
  getAll () {
    return apiAuth.get('/order/all')
  },
}
