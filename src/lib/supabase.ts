import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'
import type { TrackerPayload } from '@/types'

/**
 * عميل Supabase — يُنشأ فقط عند توفّر الإعدادات، وإلا يبقى null ويعمل التطبيق محلياً.
 */
export const supabase: SupabaseClient | null = env.cloudEnabled
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null

/**
 * حفظ المحتوى الكامل (الأسبوع الحالي + الأرشيف) في السحابة عبر RPC.
 * المزامنة مفتوحة بدون رمز PIN — تطابق عقد الواجهة الخلفية الحالي.
 */
export async function cloudSave(payload: TrackerPayload): Promise<void> {
  if (!supabase) throw new Error('CLOUD_DISABLED')
  const { error } = await supabase.rpc('tracker_save', {
    p_id: env.trackerId,
    p_data: payload,
  })
  if (error) throw error
}

/**
 * تحميل المحتوى من السحابة. يعيد null إذا لم توجد لوحة بعد.
 */
export async function cloudLoad(): Promise<TrackerPayload | null> {
  if (!supabase) throw new Error('CLOUD_DISABLED')
  const { data, error } = await supabase.rpc('tracker_load', {
    p_id: env.trackerId,
  })
  if (error) throw error
  return (data as TrackerPayload | null) ?? null
}
