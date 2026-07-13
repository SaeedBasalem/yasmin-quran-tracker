import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Archive, CloudStatus, TrackerPayload, WeekState } from '@/types'
import { createEmptyWeek, emptyTajweedRow } from '@/lib/constants'
import { deserializeWeek } from '@/lib/normalize'
import {
  buildPayload,
  loadArchive,
  loadCurrent,
  loadSavedAt,
  saveArchive,
  saveCurrent,
  saveSavedAt,
} from '@/lib/storage'
import { env } from '@/lib/env'
import { cloudLoad, cloudSave } from '@/lib/supabase'
import { datesForWeek, weekLabel } from '@/lib/dates'

interface TrackerContextValue {
  week: WeekState
  archive: Archive
  cloudStatus: CloudStatus
  savedNote: string
  /** تحديث حقل واحد في الأسبوع الحالي. */
  patchWeek: (patch: Partial<WeekState>) => void
  /** تحديث صف يوم بمؤشره. */
  patchDay: (index: number, patch: Partial<WeekState['days'][number]>) => void
  /** تحديث صف تجويد بمؤشره. */
  patchTajweed: (index: number, patch: Partial<WeekState['tajweed'][number]>) => void
  addTajweedRow: () => void
  removeTajweedRow: (index: number) => void
  /** ضبط بداية الأسبوع مع توليد تواريخ الأيام والوصف تلقائياً. */
  setWeekStart: (iso: string) => void
  archiveWeek: () => void
  loadArchived: (id: string) => void
  deleteArchived: (id: string) => void
  newWeek: () => void
  exportJSON: () => void
  importJSON: (file: File) => Promise<void>
  flash: (msg?: string) => void
}

const TrackerContext = createContext<TrackerContextValue | null>(null)

const CLOUD_DEBOUNCE_MS = 800

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [week, setWeek] = useState<WeekState>(() => {
    const stored = loadCurrent()
    return stored ? deserializeWeek(stored) : createEmptyWeek()
  })
  const [archive, setArchive] = useState<Archive>(() => loadArchive())
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(
    env.cloudEnabled ? 'idle' : 'disabled',
  )
  const [savedNote, setSavedNote] = useState('')

  // حرّاس تمنع إعادة الرفع أثناء تحميل بيانات السحابة، وتجاهل الحفظ أثناء الإقلاع.
  const applyingRemote = useRef(false)
  const booting = useRef(true)
  const cloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flash = useCallback((msg?: string) => {
    setSavedNote(msg ?? '✔ حُفِظ')
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setSavedNote(''), 2600)
  }, [])

  const pushCloud = useCallback(async (payload: TrackerPayload) => {
    if (!env.cloudEnabled) return
    setCloudStatus('syncing')
    try {
      await cloudSave(payload)
      setCloudStatus('synced')
    } catch {
      setCloudStatus('offline')
    }
  }, [])

  // حفظ محلي فوري + جدولة حفظ سحابي مؤجّل عند أي تغيير للحالة.
  useEffect(() => {
    if (booting.current || applyingRemote.current) return
    const ts = Date.now()
    saveCurrent(week)
    saveArchive(archive)
    saveSavedAt(ts)
    if (!env.cloudEnabled) return
    if (cloudTimer.current) clearTimeout(cloudTimer.current)
    const payload = buildPayload(week, archive, ts)
    cloudTimer.current = setTimeout(() => void pushCloud(payload), CLOUD_DEBOUNCE_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, archive])

  // الإقلاع السحابي: قارن الطوابع الزمنية وطبّق الأحدث.
  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (!env.cloudEnabled) {
        booting.current = false
        return
      }
      setCloudStatus('syncing')
      try {
        const remote = await cloudLoad()
        if (cancelled) return
        const remoteTs = Number(remote?.savedAt) || 0
        const localTs = loadSavedAt()
        if (remote && remoteTs > localTs) {
          applyingRemote.current = true
          setWeek(deserializeWeek(remote.current))
          setArchive(remote.archive ?? {})
          saveCurrent(deserializeWeek(remote.current))
          saveArchive(remote.archive ?? {})
          saveSavedAt(remoteTs)
          setCloudStatus('synced')
          // اسمح للحالة بالاستقرار قبل رفع الحرس.
          setTimeout(() => (applyingRemote.current = false), 0)
        } else if (localTs > remoteTs) {
          await pushCloud(buildPayload(week, archive, localTs))
        } else {
          setCloudStatus(remote ? 'synced' : 'idle')
          if (!remote) await pushCloud(buildPayload(week, archive, localTs || Date.now()))
        }
      } catch {
        if (!cancelled) setCloudStatus('offline')
      } finally {
        booting.current = false
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const patchWeek = useCallback<TrackerContextValue['patchWeek']>((patch) => {
    setWeek((w) => ({ ...w, ...patch }))
  }, [])

  const patchDay = useCallback<TrackerContextValue['patchDay']>((index, patch) => {
    setWeek((w) => ({
      ...w,
      days: w.days.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    }))
  }, [])

  const patchTajweed = useCallback<TrackerContextValue['patchTajweed']>((index, patch) => {
    setWeek((w) => ({
      ...w,
      tajweed: w.tajweed.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }))
  }, [])

  const addTajweedRow = useCallback(() => {
    setWeek((w) => ({ ...w, tajweed: [...w.tajweed, emptyTajweedRow()] }))
  }, [])

  const removeTajweedRow = useCallback((index: number) => {
    setWeek((w) => ({ ...w, tajweed: w.tajweed.filter((_, i) => i !== index) }))
  }, [])

  const setWeekStart = useCallback((iso: string) => {
    setWeek((w) => {
      const dates = datesForWeek(iso)
      return {
        ...w,
        weekStart: iso,
        week: weekLabel(iso) || w.week,
        days: w.days.map((d, i) => ({ ...d, date: dates[i] ?? d.date })),
      }
    })
  }, [])

  const archiveWeek = useCallback(() => {
    setArchive((a) => {
      const label = week.week.trim() || `أسبوع ${new Date().toLocaleDateString('ar-EG')}`
      const id = `w_${Date.now()}`
      return { ...a, [id]: { label, savedAt: Date.now(), data: week } }
    })
    flash('📁 أُضيف للأرشيف')
  }, [week, flash])

  const loadArchived = useCallback(
    (id: string) => {
      const entry = archive[id]
      if (!entry) return
      applyingRemote.current = false
      setWeek(deserializeWeek(entry.data))
      flash(`📂 فُتح «${entry.label}»`)
    },
    [archive, flash],
  )

  const deleteArchived = useCallback(
    (id: string) => {
      setArchive((a) => {
        const next = { ...a }
        delete next[id]
        return next
      })
      flash('🗑️ حُذف من الأرشيف')
    },
    [flash],
  )

  const newWeek = useCallback(() => {
    setWeek((w) => {
      const fresh = createEmptyWeek()
      fresh.student = w.student
      fresh.totalPages = w.totalPages
      fresh.lastReached = w.lastReached
      return fresh
    })
    flash('➕ أسبوع جديد')
  }, [flash])

  const exportJSON = useCallback(() => {
    const payload = buildPayload(week, archive, Date.now())
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `حفظ_${week.student || 'ياسمين'}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [week, archive])

  const importJSON = useCallback(
    async (file: File) => {
      const text = await file.text()
      try {
        const obj = JSON.parse(text) as Partial<TrackerPayload> & Record<string, unknown>
        const currentRaw = obj.current ?? obj
        setWeek(deserializeWeek(currentRaw))
        if (obj.archive && typeof obj.archive === 'object') setArchive(obj.archive as Archive)
        flash('⬆️ تم الاستيراد بنجاح')
      } catch {
        flash('⚠️ ملف غير صالح')
      }
    },
    [flash],
  )

  const value = useMemo<TrackerContextValue>(
    () => ({
      week,
      archive,
      cloudStatus,
      savedNote,
      patchWeek,
      patchDay,
      patchTajweed,
      addTajweedRow,
      removeTajweedRow,
      setWeekStart,
      archiveWeek,
      loadArchived,
      deleteArchived,
      newWeek,
      exportJSON,
      importJSON,
      flash,
    }),
    [
      week,
      archive,
      cloudStatus,
      savedNote,
      patchWeek,
      patchDay,
      patchTajweed,
      addTajweedRow,
      removeTajweedRow,
      setWeekStart,
      archiveWeek,
      loadArchived,
      deleteArchived,
      newWeek,
      exportJSON,
      importJSON,
      flash,
    ],
  )

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTracker(): TrackerContextValue {
  const ctx = useContext(TrackerContext)
  if (!ctx) throw new Error('useTracker must be used within a TrackerProvider')
  return ctx
}
