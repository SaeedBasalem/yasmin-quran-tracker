import { useMemo } from 'react'
import { useTracker } from '@/store/tracker-store'
import { computeStats } from '@/lib/stats'
import { MAX_WEEKLY_STARS } from '@/lib/constants'

/** بطاقات الإحصاءات الأسبوعية (تُحسب تلقائياً). */
export function StatsGrid() {
  const { week } = useTracker()
  const stats = useMemo(() => computeStats(week), [week])

  return (
    <div className="stats">
      <Stat num={stats.daysMemorized} label="أيام حفظ هذا الأسبوع" />
      <Stat num={`${stats.totalStars}`} label={`مجموع النجوم (من ${MAX_WEEKLY_STARS})`} />
      <Stat num={`${stats.wirdDays}/7`} label="الالتزام بالورد والأذكار" />
      <Stat num={stats.excellentDays} label="أيام «ممتاز»" />
    </div>
  )
}

function Stat({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="stat">
      <div className="num">{num}</div>
      <div className="lbl">{label}</div>
    </div>
  )
}
