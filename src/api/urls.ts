import { apiClient } from './client'
import type { Page, UrlCreateRequest, UrlDashboardResponse, UrlResponse, UrlUpdateRequest } from '@/types/api'

export const urlsApi = {
  create: (payload: UrlCreateRequest) => apiClient.post<UrlResponse>('/urls', payload).then((r) => r.data),

  listMine: (page = 0, size = 10) =>
    apiClient.get<Page<UrlDashboardResponse>>('/urls/my', { params: { page, size } }).then((r) => r.data),

  toggle: (urlId: number) => apiClient.patch<UrlResponse>(`/urls/${urlId}/toggle`).then((r) => r.data),

  update: (urlId: number, payload: UrlUpdateRequest) =>
    apiClient.patch<UrlResponse>(`/urls/${urlId}`, payload).then((r) => r.data),

  remove: (urlId: number) => apiClient.delete<void>(`/urls/${urlId}`).then((r) => r.data)
}
