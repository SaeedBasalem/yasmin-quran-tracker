import surahs from '@/data/surahs.json'

/** قائمة إكمال تلقائي بأسماء السور الـ114 لحقل «السورة / الجزء». */
export function SurahDatalist() {
  return (
    <datalist id="surah-list">
      {surahs.map((s) => (
        <option key={s.number} value={`سورة ${s.name}`}>
          {`${s.number} — ${s.name} (${s.type}، تبدأ ص ${s.startPage})`}
        </option>
      ))}
    </datalist>
  )
}
