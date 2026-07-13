import { DAYS_COUNT } from './constants'

/** تنسيق يوم/شهر بصيغة DD/MM. */
export function formatDayMonth(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

/**
 * يولّد تواريخ الأيام السبعة انطلاقاً من تاريخ بداية الأسبوع (ISO: YYYY-MM-DD).
 * يعيد مصفوفة نصوص DD/MM، أو أصفاراً فارغة إذا كان التاريخ غير صالح.
 */
export function datesForWeek(weekStartISO: string): string[] {
  if (!weekStartISO) return Array.from({ length: DAYS_COUNT }, () => '')
  const start = new Date(`${weekStartISO}T00:00:00`)
  if (Number.isNaN(start.getTime())) return Array.from({ length: DAYS_COUNT }, () => '')
  return Array.from({ length: DAYS_COUNT }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return formatDayMonth(d)
  })
}

/** يبني وصف الأسبوع "من DD/MM إلى DD/MM". */
export function weekLabel(weekStartISO: string): string {
  if (!weekStartISO) return ''
  const start = new Date(`${weekStartISO}T00:00:00`)
  if (Number.isNaN(start.getTime())) return ''
  const end = new Date(start)
  end.setDate(start.getDate() + DAYS_COUNT - 1)
  return `من ${formatDayMonth(start)} إلى ${formatDayMonth(end)}`
}

/** وقت الآن بصيغة عربية HH:MM. */
export function timeNow(): string {
  return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
}
