import { MAX_STARS } from '@/lib/constants'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  className?: string
  ariaLabel?: string
}

/**
 * تقييم بالنجوم (0–5). النقر على نجمة يضبط القيمة؛ النقر على النجمة الحالية
 * ينقص واحداً (يطابق سلوك الإصدار المستقل).
 */
export function StarRating({ value, onChange, className, ariaLabel }: StarRatingProps) {
  return (
    <span
      className={`stars ${className ?? ''}`}
      role="radiogroup"
      aria-label={ariaLabel ?? 'تقييم بالنجوم'}
    >
      {Array.from({ length: MAX_STARS }, (_, i) => {
        const v = i + 1
        const on = v <= value
        return (
          <span
            key={v}
            className={`star ${on ? 'on' : ''}`}
            role="radio"
            aria-checked={on}
            aria-label={`${v} نجوم`}
            tabIndex={0}
            onClick={() => onChange(v === value ? v - 1 : v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onChange(v === value ? v - 1 : v)
              }
            }}
          >
            ★
          </span>
        )
      })}
    </span>
  )
}
