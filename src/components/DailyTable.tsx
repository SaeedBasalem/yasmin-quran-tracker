import { useTracker } from '@/store/tracker-store'
import { WEEK_DAYS } from '@/lib/constants'
import { gradeClass } from '@/lib/grades'
import { AutoTextarea } from './AutoTextarea'
import { StarRating } from './StarRating'

/** الجدول الأول: المتابعة اليومية للأيام السبعة. */
export function DailyTable() {
  const { week, patchDay } = useTracker()

  return (
    <>
      <div className="sec-title">أولاً: المتابعة اليومية</div>
      <table id="dailyTable">
        <colgroup>
          <col style={{ width: '11%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '19%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>اليوم / التاريخ</th>
            <th>الحفظ الجديد (من – إلى)</th>
            <th>التقدير</th>
            <th>المراجعة القريبة</th>
            <th>المراجعة البعيدة</th>
            <th>الورد والأذكار</th>
            <th>النجوم ⭐</th>
            <th>ملاحظات التجويد</th>
          </tr>
        </thead>
        <tbody>
          {week.days.map((day, i) => (
            <tr key={i}>
              <td className="date-cell">
                <span className="day">{WEEK_DAYS[i]}</span>
                <br />
                <AutoTextarea
                  value={day.date}
                  aria-label={`تاريخ ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { date: e.target.value })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={day.newMemorization}
                  aria-label={`الحفظ الجديد ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { newMemorization: e.target.value })}
                />
              </td>
              <td className={gradeClass(day.grade)}>
                <input
                  className="cell-input"
                  value={day.grade}
                  aria-label={`التقدير ${WEEK_DAYS[i]}`}
                  list="grade-list"
                  onChange={(e) => patchDay(i, { grade: e.target.value })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={day.nearReview}
                  aria-label={`المراجعة القريبة ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { nearReview: e.target.value })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={day.farReview}
                  aria-label={`المراجعة البعيدة ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { farReview: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className="wird"
                  checked={day.wird}
                  aria-label={`الورد والأذكار ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { wird: e.target.checked })}
                />
              </td>
              <td>
                <StarRating
                  value={day.stars}
                  ariaLabel={`نجوم ${WEEK_DAYS[i]}`}
                  onChange={(v) => patchDay(i, { stars: v })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={day.tajweed}
                  aria-label={`ملاحظات التجويد ${WEEK_DAYS[i]}`}
                  onChange={(e) => patchDay(i, { tajweed: e.target.value })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="legend">
        <b>دليل التقدير:</b> ممتاز (بلا خطأ) — جيد جداً (1-2 خطأ) — جيد (3-4) — يُعاد (أكثر).
        &nbsp;&nbsp; <b>النجوم:</b> ⭐ للحفظ المتقن + ⭐ للمراجعة + ⭐ للورد والأذكار + ⭐ للالتزام
        + ⭐ لتحسّن التجويد.
        <br />
        <span style={{ color: '#8a8f8b' }}>
          💡 اكتبي في خانة التقدير إحدى الكلمات (ممتاز/جيد جداً/جيد/يعاد) لتتلوّن الخانة تلقائياً.
        </span>
      </div>
    </>
  )
}
