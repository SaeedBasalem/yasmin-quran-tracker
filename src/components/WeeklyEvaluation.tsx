import { useMemo } from 'react'
import { useTracker } from '@/store/tracker-store'
import { computeStats } from '@/lib/stats'
import { MAX_WEEKLY_STARS } from '@/lib/constants'
import { StarRating } from './StarRating'
import type { WeeklyGrade } from '@/types'

const WEEKLY_GRADES: WeeklyGrade[] = ['ممتاز', 'جيد جداً', 'جيد', 'يحتاج همّة']

/** القسم الثالث: التقييم الأسبوعي والدعاء. */
export function WeeklyEvaluation() {
  const { week, patchWeek } = useTracker()
  const stats = useMemo(() => computeStats(week), [week])

  return (
    <>
      <div className="sec-title">ثالثاً: التقييم الأسبوعي والدعاء</div>
      <div className="eval">
        <div className="box cream">
          <div className="line">
            نجوم الأسبوع (التقدير العام):{' '}
            <StarRating
              className="week-stars"
              value={week.weekStars}
              ariaLabel="نجوم الأسبوع"
              onChange={(v) => patchWeek({ weekStars: v })}
            />{' '}
            <span className="auto-num">{stats.totalStars}</span> / {MAX_WEEKLY_STARS}
          </div>
          <div className="line">تقدير الأسبوع العام:</div>
          <div className="checks">
            {WEEKLY_GRADES.map((g) => (
              <label key={g}>
                <input
                  type="checkbox"
                  checked={week.weeklyGrade === g}
                  onChange={(e) => patchWeek({ weeklyGrade: e.target.checked ? g : '' })}
                />{' '}
                {g}
              </label>
            ))}
          </div>
          <div className="line">ملاحظة المعلّم التشجيعية:</div>
          <textarea
            rows={3}
            value={week.teacherNote}
            aria-label="ملاحظة المعلّم"
            onChange={(e) => patchWeek({ teacherNote: e.target.value })}
          />
        </div>
        <div className="box green">
          <div className="line">هدف الأسبوع القادم:</div>
          <textarea
            rows={2}
            value={week.nextGoal}
            aria-label="هدف الأسبوع القادم"
            onChange={(e) => patchWeek({ nextGoal: e.target.value })}
          />
          <div className="line">دعاء الأسبوع:</div>
          <div className="dua">
            «اللّهُمَّ اجعَلِ القُرآنَ رَبيعَ قَلبِها، ونورَ صَدرِها، وجَلاءَ حُزنِها، وذَهابَ
            هَمِّها»
          </div>
        </div>
      </div>
    </>
  )
}
