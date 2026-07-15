import { TrackerProvider } from '@/store/tracker-store'
import { Toolbar } from '@/components/Toolbar'
import { Header } from '@/components/Header'
import { StudentInfo } from '@/components/StudentInfo'
import { ProgressPanel } from '@/components/ProgressPanel'
import { DailyTable } from '@/components/DailyTable'
import { StatsGrid } from '@/components/StatsGrid'
import { TajweedTable } from '@/components/TajweedTable'
import { WeeklyEvaluation } from '@/components/WeeklyEvaluation'
import { Reminders } from '@/components/Reminders'
import { SurahDatalist } from '@/components/SurahDatalist'
import { GradeDatalist } from '@/components/GradeDatalist'
import { WeeklyReport } from '@/components/WeeklyReport'

export default function App() {
  return (
    <TrackerProvider>
      <Toolbar />
      <main className="sheet" id="sheet">
        <Header />
        <StudentInfo />
        <ProgressPanel />
        <DailyTable />
        <StatsGrid />
        <TajweedTable />
        <WeeklyEvaluation />
        <Reminders />
        <p className="footer-dua">
          نسأل الله أن يجعلها من أهل القرآن الذين هم أهل الله وخاصّته ♥
        </p>
      </main>
      <SurahDatalist />
      <GradeDatalist />
      {/* تقرير الأسبوع — يُركّب خارج الشاشة ويُلتقط عند التصدير إلى PDF */}
      <div className="report-offscreen" aria-hidden="true">
        <WeeklyReport />
      </div>
    </TrackerProvider>
  )
}
