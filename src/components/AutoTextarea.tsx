import { useEffect, useRef, type TextareaHTMLAttributes } from 'react'

type AutoTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string
}

/**
 * حقل نصّي داخل خلايا الجدول ينمو تلقائياً بحسب المحتوى — بديل نظيف عن
 * contenteditable المستخدم في الإصدار المستقل.
 */
export function AutoTextarea({ value, className, ...rest }: AutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      className={`cell-input ${className ?? ''}`}
      value={value}
      {...rest}
    />
  )
}
