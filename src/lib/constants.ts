import type { DayRow, TajweedRow, WeekState } from '@/types'

/** اسم الطالبة (ثابت — يُعرض في الترويسة والتقرير). */
export const STUDENT_NAME = 'ياسمين'

/** اسم المعلّم (يُعرض في تقرير الأسبوع). */
export const TEACHER_NAME = 'أ. سعيد'

/** إجمالي صفحات المصحف (طبعة المدينة). */
export const TOTAL_PAGES = 604

/** متوسط عدد الصفحات في الجزء الواحد. */
export const PAGES_PER_JUZ = 604 / 30 // ≈ 20.13

/** أيام الأسبوع بالترتيب المستخدم في الجدول. */
export const WEEK_DAYS = [
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
  'الأحد',
] as const

/** مفاتيح التخزين المحلي (متوافقة مع الإصدار المستقل). */
export const STORAGE_KEYS = {
  current: 'quran_tracker_yasmin_v2',
  archive: 'quran_tracker_yasmin_archive_v2',
  savedAt: 'quran_saved_at_yasmin',
} as const

/** أقصى عدد للنجوم في اليوم/الأسبوع. */
export const MAX_STARS = 5

/** عدد أيام المتابعة الأسبوعية. */
export const DAYS_COUNT = WEEK_DAYS.length

/** إجمالي النجوم الممكنة أسبوعياً (7 أيام × 5 نجوم). */
export const MAX_WEEKLY_STARS = DAYS_COUNT * MAX_STARS // 35

function emptyDay(): DayRow {
  return {
    date: '',
    newMemorization: '',
    grade: '',
    nearReview: '',
    farReview: '',
    wird: false,
    stars: 0,
    tajweed: '',
  }
}

export function emptyTajweedRow(): TajweedRow {
  return { mistake: '', rule: '', location: '', improved: '' }
}

/** حالة أسبوع فارغة افتراضية. */
export function createEmptyWeek(): WeekState {
  return {
    student: 'ياسمين',
    week: '',
    weekStart: '',
    surah: '',
    totalPages: 0,
    lastReached: '',
    days: Array.from({ length: DAYS_COUNT }, emptyDay),
    tajweed: Array.from({ length: 5 }, emptyTajweedRow),
    weekStars: 0,
    weeklyGrade: '',
    teacherNote: '',
    nextGoal: '',
  }
}
