import { useTracker } from '@/store/tracker-store'
import { TOTAL_PAGES } from '@/lib/constants'
import { clampPages, juzApprox, progressPercent } from '@/lib/stats'

/** لوحة التقدّم التراكمي: عدد الصفحات، الأجزاء، وشريط النسبة. */
export function ProgressPanel() {
  const { week, patchWeek } = useTracker()
  const pages = clampPages(week.totalPages)
  const pct = progressPercent(pages)

  return (
    <div className="progress-panel">
      <div className="row">
        <label>📖 التقدّم التراكمي في الحفظ —</label>
        <label htmlFor="pagesInput">عدد الصفحات المحفوظة:</label>
        <input
          id="pagesInput"
          type="number"
          min={0}
          max={TOTAL_PAGES}
          value={week.totalPages || ''}
          onChange={(e) => patchWeek({ totalPages: Number(e.target.value) || 0 })}
        />
        <span className="prog-meta">≈ {juzApprox(pages)} جزء</span>
        <label htmlFor="lastReached">آخر ما وصلت إليه:</label>
        <input
          id="lastReached"
          type="text"
          value={week.lastReached}
          placeholder="مثال: سورة النساء، آية 50"
          onChange={(e) => patchWeek({ lastReached: e.target.value })}
        />
      </div>
      <div className="bar">
        <div style={{ width: `${pct}%` }} />
        <span>
          {pct}% ({pages} / {TOTAL_PAGES} صفحة)
        </span>
      </div>
    </div>
  )
}
