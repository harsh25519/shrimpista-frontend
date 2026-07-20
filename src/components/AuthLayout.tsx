import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-5 py-12">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <Link to="/">
          <Logo size={34} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-(--color-mist)">{subtitle}</p>
        </div>
      </div>
      <div className="card p-6">{children}</div>
    </div>
  )
}
