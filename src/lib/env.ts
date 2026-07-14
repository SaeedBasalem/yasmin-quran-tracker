/**
 * إعدادات البيئة — تُقرأ من متغيّرات Vite (`import.meta.env`).
 * انسخ `.env.example` إلى `.env` واملأ القيم.
 *
 * المفتاح المستخدم هنا هو المفتاح العام (publishable/anon) وهو آمن للعرض في
 * المتصفح لأن كل وصول للبيانات يمرّ عبر دوال RPC محمية + Row Level Security.
 */

// قيم افتراضية للمشروع الحالي، تُستخدم إن لم تُضبط متغيّرات البيئة (مثلاً عند
// النشر على GitHub Pages دون إضافة الأسرار). المفتاح عام (publishable) ومنشور
// أصلاً في الإصدار المستقل، لذا لا خطورة في تضمينه.
const DEFAULT_SUPABASE_URL = 'https://vfyzedlyveukjaukcekq.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_0rV81EKte4h5bhFyj6Nf4g_kDDLiDTD'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const trackerId = (import.meta.env.VITE_TRACKER_ID as string | undefined) ?? 'yasmin'

export const env = {
  supabaseUrl: url || DEFAULT_SUPABASE_URL,
  supabaseAnonKey: anonKey || DEFAULT_SUPABASE_ANON_KEY,
  trackerId,
  /** هل إعدادات السحابة مكتملة؟ إن لا، يعمل التطبيق محلياً فقط. */
  get cloudEnabled(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseAnonKey)
  },
}

if (!env.cloudEnabled && import.meta.env.DEV) {
  console.warn(
    '[Quran Tracker] لم تُضبط متغيّرات Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'سيعمل التطبيق محلياً بدون مزامنة سحابية.',
  )
}
