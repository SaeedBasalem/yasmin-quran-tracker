import grades from '@/data/gradeOptions.json'

/** قائمة إكمال تلقائي لخيارات التقدير اليومي. */
export function GradeDatalist() {
  return (
    <>
      <datalist id="grade-list">
        {grades.daily.map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
      <datalist id="improved-list">
        {grades.improved.map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>
    </>
  )
}
