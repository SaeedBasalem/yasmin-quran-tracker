/**
 * أنواع البيانات المشتركة عبر التطبيق.
 */

/** تقدير الحفظ اليومي. */
export type Grade = 'ممتاز' | 'جيد جداً' | 'جيد' | 'يُعاد' | ''

/** صف يوم واحد في جدول المتابعة اليومية. */
export interface DayRow {
  /** تاريخ اليوم (يُملأ تلقائياً من بداية الأسبوع، قابل للتعديل). */
  date: string
  /** الحفظ الجديد (من – إلى). */
  newMemorization: string
  /** التقدير النصّي (يُلوّن الخلية تلقائياً). */
  grade: string
  /** المراجعة القريبة. */
  nearReview: string
  /** المراجعة البعيدة. */
  farReview: string
  /** الالتزام بالورد والأذكار. */
  wird: boolean
  /** عدد النجوم (0–5). */
  stars: number
  /** ملاحظات التجويد. */
  tajweed: string
}

/** صف واحد في جدول أخطاء التجويد. */
export interface TajweedRow {
  /** الخطأ الملاحَظ. */
  mistake: string
  /** الحكم التجويدي. */
  rule: string
  /** الكلمة / الموضع. */
  location: string
  /** هل تحسّن؟ */
  improved: string
}

/** التقدير العام للأسبوع (اختيار واحد). */
export type WeeklyGrade = 'ممتاز' | 'جيد جداً' | 'جيد' | 'يحتاج همّة' | ''

/** الحالة الكاملة للأسبوع الحالي — هي مصدر الحقيقة للواجهة. */
export interface WeekState {
  /** اسم الطالبة. */
  student: string
  /** وصف الأسبوع (من ____ إلى ____). */
  week: string
  /** بداية الأسبوع (ISO date، يستخدم لتوليد تواريخ الأيام). */
  weekStart: string
  /** السورة / الجزء. */
  surah: string
  /** عدد الصفحات المحفوظة تراكمياً (0–604). */
  totalPages: number
  /** آخر ما وصلت إليه (نصّي). */
  lastReached: string
  /** صفوف الأيام السبعة. */
  days: DayRow[]
  /** صفوف أخطاء التجويد. */
  tajweed: TajweedRow[]
  /** نجوم الأسبوع العامة (0–5). */
  weekStars: number
  /** التقدير العام للأسبوع. */
  weeklyGrade: WeeklyGrade
  /** ملاحظة المعلّم التشجيعية. */
  teacherNote: string
  /** هدف الأسبوع القادم. */
  nextGoal: string
}

/** عنصر أرشيف (أسبوع محفوظ سابقاً). */
export interface ArchiveEntry {
  label: string
  savedAt: number
  data: WeekState
}

/** خريطة الأرشيف: المعرّف → العنصر. */
export type Archive = Record<string, ArchiveEntry>

/** الحمولة الكاملة المتزامنة مع السحابة والتصدير. */
export interface TrackerPayload {
  current: WeekState
  archive: Archive
  savedAt: number
}

/** حالة المزامنة السحابية المعروضة للمستخدم. */
export type CloudStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'disabled'
