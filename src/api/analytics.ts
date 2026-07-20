import { apiClient } from './client'
import type { ClickEventResponse, Page, StatsResponse } from '@/types/api'

export const analyticsApi = {
  getStats: (shortCode: string) => apiClient.get<StatsResponse>(`/stats/${shortCode}`).then((r) => r.data),

  getClicks: (shortCode: string, page = 0, size = 10) =>
    apiClient
      .get<Page<ClickEventResponse>>(`/clicks/${shortCode}`, { params: { page, size } })
      .then((r) => r.data),
}
