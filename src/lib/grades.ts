/**
 * منطق تلوين التقديرات — يطابق سلوك الإصدار المستقل.
 */

export type GradeClass = 'g-mumtaz' | 'g-jj' | 'g-jayed' | 'g-redo' | ''

/** يحدّد فئة اللون بناءً على نص التقدير المُدخَل. */
export function gradeClass(text: string): GradeClass {
  const t = (text || '').trim()
  if (!t) return ''
  if (t.includes('ممتاز')) return 'g-mumtaz'
  if (t.includes('جداً') || t.includes('جدا')) return 'g-jj'
  if (t.includes('جيد')) return 'g-jayed'
  if (t.includes('يعاد') || t.includes('يُعاد') || t.includes('يحتاج') || t.includes('ضعيف'))
    return 'g-redo'
  return ''
}

/** هل يُعدّ هذا التقدير "ممتازاً"؟ (يُستخدم في الإحصاءات). */
export function isExcellent(text: string): boolean {
  return (text || '').includes('ممتاز')
}
