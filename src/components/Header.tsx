import { MushafIcon } from './MushafIcon'
import { STUDENT_NAME } from '@/lib/constants'

/** ترويسة الصفحة: الشعار، البسملة، العنوان مع اسم الطالبة، والحديث. */
export function Header() {
  return (
    <header>
      <MushafIcon />
      <p className="basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <h1>
        جدول المتابعة الأسبوعي لحفظ القرآن الكريم
        <span className="student-badge">🌸 {STUDENT_NAME}</span>
      </h1>
      <p className="hadith">«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»</p>
      <div className="divider">﴿ ❁ ﴾</div>
    </header>
  )
}
