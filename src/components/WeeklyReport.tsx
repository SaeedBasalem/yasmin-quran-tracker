import { useTracker } from '@/store/tracker-store'
import { WEEK_DAYS, STUDENT_NAME, TEACHER_NAME, MAX_WEEKLY_STARS, MAX_STARS } from '@/lib/constants'
import { computeStats, progressPercent, juzApprox, clampPages } from '@/lib/stats'
import { gradeClass } from '@/lib/grades'
import { timeNow } from '@/lib/dates'

/**
 * تقرير الأسبوع القابل للتصدير إلى PDF — تصميم مستقلّ عن صفحة الموقع.
 * يُركَّب دائماً خارج الشاشة (في App)، ويُلتقط عند الضغط على «تقرير PDF».
 */
export function WeeklyReport() {
  const { week, reportRef } = useTracker()
  const stats = computeStats(week)
  const pages = clampPages(week.totalPages)
  const pct = progressPercent(pages)
  const today = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="report" ref={reportRef} dir="rtl">
      <div className="report-inner">
        <div className="rep-head">
          <p className="rep-basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="rep-title">تقرير متابعة حفظ القرآن الكريم</h1>
          <p className="rep-sub">«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»</p>
        </div>

        <div className="rep-meta">
          <div className="cell">
            <div className="k">الطالبة</div>
            <div className="v">🌸 {STUDENT_NAME}</div>
          </div>
          <div className="cell">
            <div className="k">الأسبوع</div>
            <div className="v">{week.week || '—'}</div>
          </div>
          <div className="cell">
            <div className="k">تاريخ التقرير</div>
            <div className="v">{today}</div>
          </div>
        </div>

        <div className="rep-progress">
          <div className="rep-ring">
            <span className="pct">{pct}%</span>
            <span className="pct-lbl">من المصحف</span>
          </div>
          <div className="facts">
            <div className="big">📖 التقدّم التراكمي في الحفظ</div>
            <div className="line">
              الصفحات المحفوظة: <b>{pages}</b> من 604 صفحة (≈ <b>{juzApprox(pages)}</b> جزء)
            </div>
            <div className="line">
              آخر ما وصلت إليه: <b>{week.lastReached || '—'}</b>
            </div>
            {week.surah ? (
              <div className="line">
                سورة الأسبوع: <b>{week.surah}</b>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rep-section-title">حفظ الأسبوع يوماً بيوم</div>
        <table className="rep-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>اليوم</th>
              <th style={{ width: '38%' }}>الحفظ الجديد</th>
              <th style={{ width: '20%' }}>التقدير</th>
              <th style={{ width: '22%' }}>النجوم</th>
            </tr>
          </thead>
          <tbody>
            {week.days.map((day, i) => {
              const empty = !day.newMemorization.trim()
              return (
                <tr key={i}>
                  <td>
                    <div className="day-name">{WEEK_DAYS[i]}</div>
                    {day.date ? <div className="day-date">{day.date}</div> : null}
                  </td>
                  <td className={empty ? 'empty' : ''}>{day.newMemorization.trim() || '—'}</td>
                  <td>
                    {day.grade.trim() ? (
                      <span className={`rep-grade ${gradeClass(day.grade)}`}>{day.grade}</span>
                    ) : (
                      <span className="empty">—</span>
                    )}
                  </td>
                  <td>
                    <Stars value={day.stars} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="rep-section-title">حصيلة الأسبوع</div>
        <div className="rep-stats">
          <div className="s">
            <div className="n">{stats.daysMemorized}</div>
            <div className="l">أيام حفظ جديد</div>
          </div>
          <div className="s">
            <div className="n">
              {stats.totalStars}
              <span style={{ fontSize: 13, color: '#9a875f' }}> / {MAX_WEEKLY_STARS}</span>
            </div>
            <div className="l">مجموع النجوم</div>
          </div>
          <div className="s">
            <div className="n">{stats.wirdDays}/7</div>
            <div className="l">الالتزام بالورد</div>
          </div>
          <div className="s">
            <div className="n">{stats.excellentDays}</div>
            <div className="l">أيام «ممتاز»</div>
          </div>
        </div>

        <div className="rep-notes">
          <div className="note">
            <div className="h">✍️ ملاحظة المعلّم</div>
            <div className="b">{week.teacherNote.trim() || 'أحسنتِ، واصلي على هذا الخير 🌟'}</div>
          </div>
          <div className="note">
            <div className="h">🎯 هدف الأسبوع القادم</div>
            <div className="b">{week.nextGoal.trim() || '—'}</div>
          </div>
        </div>

        <div className="rep-dua">
          «اللّهُمَّ اجعَلِ القُرآنَ رَبيعَ قَلبِها، ونورَ صَدرِها، وجَلاءَ حُزنِها، وذَهابَ هَمِّها»
        </div>

        <div className="rep-sign">
          <div className="col">
            <div className="name">{TEACHER_NAME}</div>
            <div className="rule">توقيع المعلّم</div>
          </div>
          <div className="col">
            <div className="name">{week.weeklyGrade || '—'}</div>
            <div className="rule">التقدير العام للأسبوع</div>
          </div>
        </div>

        <div className="rep-foot">أُنشئ هذا التقرير في {today} — {timeNow()} ♥</div>
      </div>
    </div>
  )
}

function Stars({ value }: { value: number }) {
  return (
    <span className="rep-stars">
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span key={i} className={i < value ? 'on' : ''}>
          ★
        </span>
      ))}
    </span>
  )
}
