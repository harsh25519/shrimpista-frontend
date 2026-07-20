export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 20c0-7 5-13 12-13 5 0 9 3 9 7 0 3-2 5-5 5-2 0-3-1-3-3 0-1.5 1-2.5 2.5-2.5"
          stroke="var(--color-bio)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="10" cy="14" r="1.6" fill="var(--color-coral)" />
        <path
          d="M6 20c-1.5 1.5-2.5 3.5-2.5 5.5 2.5 0 4.8-1 6.3-2.6M9 22c-1 1.2-1.6 2.7-1.6 4.2 2 0 3.8-.8 5-2.1"
          stroke="var(--color-coral)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="font-display font-semibold text-lg tracking-tight text-(--color-foam)">
        Shrimpista
      </span>
    </div>
  )
}
