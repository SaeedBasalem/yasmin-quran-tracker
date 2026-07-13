/**
 * إعدادات البيئة — تُقرأ من متغيّرات Vite (`import.meta.env`).
 * انسخ `.env.example` إلى `.env` واملأ القيم.
 *
 * المفتاح المستخدم هنا هو المفتاح العام (publishable/anon) وهو آمن للعرض في
 * المتصفح لأن كل وصول للبيانات يمرّ عبر دوال RPC محمية + Row Level Security.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const trackerId = (import.meta.env.VITE_TRACKER_ID as string | undefined) ?? 'yasmin'

export const env = {
  supabaseUrl: url ?? '',
  supabaseAnonKey: anonKey ?? '',
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
