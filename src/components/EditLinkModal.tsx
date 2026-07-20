import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { Modal } from './Modal'
import { urlsApi } from '@/api/urls'
import { extractErrorMessage } from '@/api/client'
import type { UrlDashboardResponse, UrlResponse } from '@/types/api'

interface EditLinkModalProps {
  link: UrlDashboardResponse
  onClose: () => void
  onUpdated: (updated: UrlResponse) => void
}

export function EditLinkModal({ link, onClose, onUpdated }: EditLinkModalProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState(link.title ?? '')
  const [expiresAt, setExpiresAt] = useState(link.expiresAt ? link.expiresAt.slice(0, 16) : '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await urlsApi.update(link.urlId, {
        longUrl: url.trim(),
        title: title.trim() || undefined,
        isActive: link.isActive,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      })
      toast.success('Link updated')
      onUpdated(updated)
      onClose()
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not update this link.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit link">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Destination URL</label>
          <input
            required
            type="url"
            placeholder="https://example.com/new-destination"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input"
          />
          <p className="mt-1.5 text-xs text-(--color-mist)">
            The API requires the full destination on every update, even if it isn't changing — re-enter it here.
          </p>
        </div>
        <div>
          <label className="label">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" maxLength={120} />
        </div>
        <div>
          <label className="label">Expires at (optional)</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary text-sm">
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
