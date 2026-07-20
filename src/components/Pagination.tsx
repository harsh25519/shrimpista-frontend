import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 0}
        className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={15} /> Prev
      </button>
      <span className="text-xs font-mono text-(--color-mist)">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight size={15} />
      </button>
    </div>
  )
}
