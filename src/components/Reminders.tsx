import reminders from '@/data/reminders.json'

/** القسم الرابع: معينات على المداومة. */
export function Reminders() {
  return (
    <>
      <div className="sec-title">رابعاً: معينات على المداومة</div>
      <div className="reminders">
        <h3>معينات على معاهدة القرآن والمداومة عليه</h3>
        <ul>
          {reminders.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
