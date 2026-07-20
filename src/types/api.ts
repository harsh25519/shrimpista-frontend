// Mirrors the Java records / response shapes documented in API.md

export interface MessageResponse {
  message: string
}

export interface ErrorResponse {
  status: number
  message: string
  timestamp: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface JwtPrincipal {
  userId: string
  clientId: string
  roles: string[]
}

export type OAuthProvider = 'GOOGLE' | 'GITHUB'

export interface UrlResponse {
  urlId: number
  shortCode: string
  longUrl: string
  title: string | null
  createdAt: string
}

export interface UrlDashboardResponse {
  urlId: number
  shortCode: string
  title: string | null
  createdAt: string
  expiresAt: string | null
  isActive: boolean
}

export interface UrlCreateRequest {
  longUrl: string
  title?: string
}

export interface UrlUpdateRequest {
  longUrl: string
  title?: string
  isActive?: boolean
  expiresAt?: string | null
}

export interface ClickEventResponse {
  ipAddress: string
  userAgent: string
  referrer: string | null
  clickedAt: string
}

export interface StatsResponse {
  shortCode: string
  url: string
  totalClicks: number
  uniqueVisitors: number
  lastUpdatedAt: string
}

export interface AdminUrlResponse {
  id: number
  shortCode: string
  longUrl: string
  ownerId: string | null
  isActive: boolean
  isDeleted: boolean
  createdAt: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
