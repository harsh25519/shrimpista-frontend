import { API_BASE_URL } from '@/api/client'

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function isExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() < Date.now()
}

export function shortLinkUrl(shortCode: string): string {
  return `${API_BASE_URL.replace(/\/$/, '')}/urls/${shortCode}`
}

export function truncateMiddle(value: string, max = 48): string {
  if (value.length <= max) return value
  const keep = Math.floor((max - 3) / 2)
  return `${value.slice(0, keep)}...${value.slice(value.length - keep)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
