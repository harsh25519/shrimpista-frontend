import type { ClickEventResponse } from '@/types/api'
import { formatDate, truncateMiddle } from '@/lib/format'

export function ClickTable({ clicks }: { clicks: ClickEventResponse[] }) {
  if (clicks.length === 0) {
    return <p className="py-10 text-center text-sm text-(--color-mist)">No click events recorded yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-(--color-line) text-xs uppercase tracking-wide text-(--color-mist)">
            <th className="py-2.5 pr-4 font-medium">Clicked at</th>
            <th className="py-2.5 pr-4 font-medium">Referrer</th>
            <th className="py-2.5 pr-4 font-medium">User agent</th>
            <th className="py-2.5 font-medium">Visitor hash</th>
          </tr>
        </thead>
        <tbody>
          {clicks.map((c, i) => (
            <tr key={`${c.clickedAt}-${i}`} className="border-b border-(--color-line) last:border-0">
              <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs text-(--color-foam)">
                {formatDate(c.clickedAt)}
              </td>
              <td className="py-2.5 pr-4 text-(--color-mist)">{c.referrer ? truncateMiddle(c.referrer, 32) : 'Direct'}</td>
              <td className="py-2.5 pr-4 text-(--color-mist)">{truncateMiddle(c.userAgent, 40)}</td>
              <td className="py-2.5 font-mono text-xs text-(--color-mist)">{truncateMiddle(c.ipAddress, 14)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
