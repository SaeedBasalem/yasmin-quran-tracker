import { useRef } from 'react'
import { useTracker } from '@/store/tracker-store'
import type { CloudStatus } from '@/types'

const CLOUD_LABELS: Record<CloudStatus, string> = {
  idle: '',
  syncing: '⏳ يحفظ سحابياً…',
  synced: '☁️ متزامن',
  offline: '⚠️ غير متصل — سيُحفظ لاحقاً',
  disabled: '💾 حفظ محلي فقط',
}

export function Toolbar() {
  const {
    archive,
    cloudStatus,
    savedNote,
    flash,
    archiveWeek,
    loadArchived,
    deleteArchived,
    newWeek,
    exportJSON,
    importJSON,
    exportReportPdf,
  } = useTracker()
  const fileRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const archiveEntries = Object.entries(archive).sort((a, b) => b[1].savedAt - a[1].savedAt)

  function handleDelete() {
    const id = selectRef.current?.value
    if (!id) {
      flash('اختر أسبوعاً من الأرشيف أولاً')
      return
    }
    if (window.confirm(`حذف «${archive[id]?.label ?? ''}» من الأرشيف نهائياً؟`)) {
      deleteArchived(id)
      if (selectRef.current) selectRef.current.value = ''
    }
  }

  function handleLoad(id: string) {
    if (!id) return
    if (window.confirm('فتح هذا الأسبوع سيستبدل التعبئة الحالية. أرشِف الحالي أولاً إن أردت. متابعة؟')) {
      loadArchived(id)
    }
    if (selectRef.current) selectRef.current.value = ''
  }

  function handleNewWeek() {
    if (
      window.confirm(
        'بدء أسبوع جديد سيمسح التعبئة الحالية فقط (الأرشيف يبقى محفوظاً). أرشِف الأسبوع الحالي أولاً إن أردت. متابعة؟',
      )
    ) {
      newWeek()
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await importJSON(file)
    e.target.value = ''
  }

  return (
    <div className="toolbar" id="toolbar">
      <button className="gold" onClick={() => flash()}>
        💾 حفظ
      </button>
      <button className="report-btn" onClick={() => void exportReportPdf()}>
        📄 تقرير الأسبوع (PDF)
      </button>
      <button onClick={archiveWeek}>📁 أرشفة هذا الأسبوع</button>
      <select
        ref={selectRef}
        defaultValue=""
        onChange={(e) => handleLoad(e.target.value)}
        aria-label="الأرشيف"
      >
        <option value="">— الأرشيف ({archiveEntries.length}) —</option>
        {archiveEntries.map(([id, entry]) => (
          <option key={id} value={id}>
            {entry.label}
          </option>
        ))}
      </select>
      <button className="ghost" onClick={handleDelete}>
        🗑️ حذف من الأرشيف
      </button>
      <button onClick={() => window.print()}>🖨️ طباعة / PDF</button>
      <button className="ghost" onClick={exportJSON}>
        ⬇️ تصدير
      </button>
      <button className="ghost" onClick={() => fileRef.current?.click()}>
        ⬆️ استيراد
      </button>
      <button className="ghost" onClick={handleNewWeek}>
        ➕ أسبوع جديد
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      <span className="saved-note">{savedNote}</span>
      <span className="saved-note cloud-note" data-s={cloudStatus}>
        {CLOUD_LABELS[cloudStatus]}
      </span>
    </div>
  )
}
