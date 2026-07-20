import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
      <Compass size={30} className="text-(--color-bio)" />
      <h1 className="font-display text-2xl font-semibold">Lost at sea</h1>
      <p className="text-sm text-(--color-mist)">This page doesn't exist, or the link has drifted away.</p>
      <Link to="/" className="btn-primary text-sm">
        Back to safety
      </Link>
    </div>
  )
}
