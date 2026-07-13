import type { Archive, TrackerPayload, WeekState } from '@/types'
import { STORAGE_KEYS } from './constants'

/** قراءة الأسبوع الحالي من التخزين المحلي (أو null). */
export function loadCurrent(): WeekState | null {
  return readJSON<WeekState>(STORAGE_KEYS.current)
}

/** حفظ الأسبوع الحالي محلياً. */
export function saveCurrent(week: WeekState): void {
  writeJSON(STORAGE_KEYS.current, week)
}

/** قراءة الأرشيف (أو {}). */
export function loadArchive(): Archive {
  return readJSON<Archive>(STORAGE_KEYS.archive) ?? {}
}

/** حفظ الأرشيف محلياً. */
export function saveArchive(archive: Archive): void {
  writeJSON(STORAGE_KEYS.archive, archive)
}

/** الطابع الزمني لآخر حفظ محلي. */
export function loadSavedAt(): number {
  const raw = localStorage.getItem(STORAGE_KEYS.savedAt)
  return raw ? Number(raw) || 0 : 0
}

export function saveSavedAt(ts: number): void {
  localStorage.setItem(STORAGE_KEYS.savedAt, String(ts))
}

/** يبني الحمولة الكاملة للتصدير/المزامنة. */
export function buildPayload(current: WeekState, archive: Archive, savedAt: number): TrackerPayload {
  return { current, archive, savedAt }
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('تعذّر الحفظ المحلي:', e)
  }
}
