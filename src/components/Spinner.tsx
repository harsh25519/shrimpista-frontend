import { LoaderCircle } from 'lucide-react'
import clsx from 'clsx'

export function Spinner({ className, size = 18 }: { className?: string; size?: number }) {
  return <LoaderCircle size={size} className={clsx('animate-spin text-(--color-bio)', className)} />
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}
