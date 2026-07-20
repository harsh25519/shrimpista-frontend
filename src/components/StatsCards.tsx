import { MousePointerClick, Users, Clock } from 'lucide-react'
import type { StatsResponse } from '@/types/api'
import { formatDate } from '@/lib/format'

export function StatsCards({ stats }: { stats: StatsResponse }) {
  const items = [
    { label: 'Total clicks', value: stats.totalClicks.toLocaleString(), icon: MousePointerClick },
    { label: 'Unique visitors', value: stats.uniqueVisitors.toLocaleString(), icon: Users },
    { label: 'Last updated', value: formatDate(stats.lastUpdatedAt), icon: Clock, small: true },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, small }) => (
        <div key={label} className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-(--color-mist)">
            <Icon size={15} />
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
          </div>
          <p className={small ? 'font-mono text-sm text-(--color-foam)' : 'font-display text-3xl font-semibold text-(--color-foam)'}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}
