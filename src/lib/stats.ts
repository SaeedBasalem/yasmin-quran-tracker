import type { WeekState } from '@/types'
import { TOTAL_PAGES, PAGES_PER_JUZ } from './constants'
import { isExcellent } from './grades'

export interface WeekStats {
  /** أيام سُجّل فيها حفظ جديد. */
  daysMemorized: number
  /** مجموع النجوم اليومية. */
  totalStars: number
  /** عدد أيام الالتزام بالورد. */
  wirdDays: number
  /** عدد أيام التقدير "ممتاز". */
  excellentDays: number
}

/** يحسب إحصاءات الأسبوع من حالة الأيام. */
export function computeStats(week: WeekState): WeekStats {
  return week.days.reduce<WeekStats>(
    (acc, d) => {
      if (d.newMemorization.trim()) acc.daysMemorized += 1
      acc.totalStars += d.stars || 0
      if (d.wird) acc.wirdDays += 1
      if (isExcellent(d.grade)) acc.excellentDays += 1
      return acc
    },
    { daysMemorized: 0, totalStars: 0, wirdDays: 0, excellentDays: 0 },
  )
}

/** نسبة التقدّم المئوية بناءً على عدد الصفحات المحفوظة. */
export function progressPercent(totalPages: number): number {
  const pages = clampPages(totalPages)
  return Math.round((pages / TOTAL_PAGES) * 100)
}

/** عدد الأجزاء التقريبي المقابل لعدد الصفحات. */
export function juzApprox(totalPages: number): string {
  return (clampPages(totalPages) / PAGES_PER_JUZ).toFixed(1)
}

/** يقيّد عدد الصفحات ضمن [0, 604]. */
export function clampPages(pages: number): number {
  if (Number.isNaN(pages) || pages < 0) return 0
  return Math.min(pages, TOTAL_PAGES)
}
