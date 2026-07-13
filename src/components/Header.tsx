import { MushafIcon } from './MushafIcon'

/** ترويسة الصفحة: الشعار، البسملة، العنوان، والحديث. */
export function Header() {
  return (
    <header>
      <MushafIcon />
      <p className="basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      <h1>جدول المتابعة الأسبوعي لحفظ القرآن الكريم</h1>
      <p className="hadith">«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»</p>
      <div className="divider">﴿ ❁ ﴾</div>
    </header>
  )
}
