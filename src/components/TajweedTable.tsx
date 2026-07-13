import { useTracker } from '@/store/tracker-store'
import { AutoTextarea } from './AutoTextarea'

/** الجدول الثاني: أخطاء التجويد المتكررة وتعليم الأحكام. */
export function TajweedTable() {
  const { week, patchTajweed, addTajweedRow, removeTajweedRow } = useTracker()

  return (
    <>
      <div className="sec-title">ثانياً: أخطاء التجويد المتكررة وتعليم الأحكام</div>
      <p className="sec-note">
        لرصد الأخطاء الشائعة والعمل على تصحيحها درساً بعد درس (إظهار، إدغام، مدود، غنّة، أحكام الراء
        واللام...).
      </p>
      <table id="tajTable">
        <colgroup>
          <col style={{ width: '24%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '30%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '4%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>الخطأ الملاحظ</th>
            <th>الحكم التجويدي</th>
            <th>الكلمة / الموضع</th>
            <th>هل تحسّن؟</th>
            <th aria-label="حذف" />
          </tr>
        </thead>
        <tbody>
          {week.tajweed.map((row, i) => (
            <tr key={i}>
              <td>
                <AutoTextarea
                  value={row.mistake}
                  aria-label={`الخطأ ${i + 1}`}
                  onChange={(e) => patchTajweed(i, { mistake: e.target.value })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={row.rule}
                  aria-label={`الحكم ${i + 1}`}
                  onChange={(e) => patchTajweed(i, { rule: e.target.value })}
                />
              </td>
              <td>
                <AutoTextarea
                  value={row.location}
                  aria-label={`الموضع ${i + 1}`}
                  onChange={(e) => patchTajweed(i, { location: e.target.value })}
                />
              </td>
              <td>
                <input
                  className="cell-input"
                  value={row.improved}
                  aria-label={`هل تحسّن ${i + 1}`}
                  list="improved-list"
                  onChange={(e) => patchTajweed(i, { improved: e.target.value })}
                />
              </td>
              <td>
                <button
                  className="del-btn"
                  aria-label={`حذف الصف ${i + 1}`}
                  onClick={() => removeTajweedRow(i)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row" onClick={addTajweedRow}>
        ➕ إضافة صف
      </button>
    </>
  )
}
