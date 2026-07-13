import type { TajweedRow, WeekState, WeeklyGrade } from '@/types'
import { createEmptyWeek, DAYS_COUNT } from './constants'

/**
 * تحويل البيانات المحفوظة إلى `WeekState`.
 *
 * يدعم شكلين:
 *  1) الشكل الجديد المنظّم (WeekState مباشرة).
 *  2) الشكل القديم من الإصدار المستقل: { fields: {...}, taj: [...], weekStars }
 *     حيث كانت الحقول مسطّحة بمفاتيح مثل d0_new و g_mumtaz ... إلخ.
 *
 * الهدف: عدم فقدان تقدّم الطالبة المحفوظ سابقاً محلياً أو سحابياً.
 */
export function deserializeWeek(raw: unknown): WeekState {
  const base = createEmptyWeek()
  if (!raw || typeof raw !== 'object') return base

  const obj = raw as Record<string, unknown>

  // الشكل الجديد: يحتوي على مصفوفة days.
  if (Array.isArray(obj.days)) {
    return mergeNew(base, obj)
  }

  // الشكل القديم: يحتوي على كائن fields مسطّح.
  if (obj.fields && typeof obj.fields === 'object') {
    return mergeLegacy(base, obj)
  }

  return base
}

function mergeNew(base: WeekState, obj: Record<string, unknown>): WeekState {
  const merged: WeekState = {
    ...base,
    ...(obj as Partial<WeekState>),
  }
  // ضمان سلامة الأطوال والأنواع.
  merged.totalPages = num(merged.totalPages)
  merged.weekStars = clampStar(num(merged.weekStars))
  merged.days = base.days.map((d, i) => ({ ...d, ...(merged.days?.[i] ?? {}) }))
  merged.tajweed = Array.isArray(obj.tajweed) && obj.tajweed.length ? merged.tajweed : base.tajweed
  return merged
}

function mergeLegacy(base: WeekState, obj: Record<string, unknown>): WeekState {
  const f = obj.fields as Record<string, unknown>
  const week = { ...base }

  week.student = str(f.student, base.student)
  week.week = str(f.week)
  week.weekStart = str(f.weekStart)
  week.surah = str(f.surah)
  week.totalPages = num(f.totalPages)
  week.lastReached = str(f.lastReached)
  week.teacherNote = str(f.note)
  week.nextGoal = str(f.goal)
  week.weeklyGrade = legacyWeeklyGrade(f)
  week.weekStars = clampStar(num(obj.weekStars))

  week.days = Array.from({ length: DAYS_COUNT }, (_, i) => ({
    date: str(f[`d${i}_date`]),
    newMemorization: str(f[`d${i}_new`]),
    grade: str(f[`d${i}_grade`]),
    nearReview: str(f[`d${i}_near`]),
    farReview: str(f[`d${i}_far`]),
    wird: Boolean(f[`d${i}_wird`]),
    stars: clampStar(num(f[`d${i}_stars`])),
    tajweed: str(f[`d${i}_taj`]),
  }))

  const taj = Array.isArray(obj.taj) ? (obj.taj as unknown[]) : []
  const rows: TajweedRow[] = taj
    .map((r) => (Array.isArray(r) ? r : []))
    .map((r) => ({
      mistake: str(r[0]),
      rule: str(r[1]),
      location: str(r[2]),
      improved: str(r[3]),
    }))
  week.tajweed = rows.length ? rows : base.tajweed

  return week
}

function legacyWeeklyGrade(f: Record<string, unknown>): WeeklyGrade {
  if (f.g_mumtaz) return 'ممتاز'
  if (f.g_jj) return 'جيد جداً'
  if (f.g_jayed) return 'جيد'
  if (f.g_himma) return 'يحتاج همّة'
  return ''
}

function str(v: unknown, fallback = ''): string {
  if (v == null) return fallback
  return String(v)
}

function num(v: unknown): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
}

function clampStar(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n)))
}
