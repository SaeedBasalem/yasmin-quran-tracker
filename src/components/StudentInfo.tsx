import { useTracker } from '@/store/tracker-store'

/** بطاقات معلومات الطالبة والأسبوع. */
export function StudentInfo() {
  const { week, patchWeek, setWeekStart } = useTracker()

  return (
    <div className="info">
      <div className="field">
        <label htmlFor="f-student">الطالبة:</label>
        <input
          id="f-student"
          value={week.student}
          onChange={(e) => patchWeek({ student: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="f-week">الأسبوع:</label>
        <input
          id="f-week"
          value={week.week}
          placeholder="من ____ إلى ____"
          onChange={(e) => patchWeek({ week: e.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="f-weekstart">بداية الأسبوع:</label>
        <input
          id="f-weekstart"
          type="date"
          value={week.weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="f-surah">السورة / الجزء:</label>
        <input
          id="f-surah"
          value={week.surah}
          placeholder="________"
          list="surah-list"
          onChange={(e) => patchWeek({ surah: e.target.value })}
        />
      </div>
    </div>
  )
}
