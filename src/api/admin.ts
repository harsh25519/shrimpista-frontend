import { apiClient } from './client'
import type { AdminUrlResponse, Page } from '@/types/api'

export const adminApi = {
  listAll: (page = 0, size = 50) =>
    apiClient.get<Page<AdminUrlResponse>>('/admin/urls', { params: { page, size } }).then((r) => r.data),

  takedown: (urlId: number) => apiClient.delete<void>(`/admin/urls/${urlId}`).then((r) => r.data),
}
