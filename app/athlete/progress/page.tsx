import { format, parseISO } from "date-fns"
import { BarbellIcon, CalendarBlankIcon, ChartLineUpIcon, FireIcon, ListChecksIcon, TargetIcon } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import PageHeader from "@/components/page-header"
import { ComplianceRing } from "@/components/analytics/compliance-ring"
import { EmptyState } from "@/components/analytics/empty-state"
import { MetricHelp } from "@/components/analytics/metric-help"
import { ProgressBar } from "@/components/analytics/progress-bar"
import { TrendChart } from "@/components/analytics/trend-chart"
import { VolumeChart } from "@/components/analytics/volume-chart"
import { getMyProgress } from "@/api/dashboard"
import { ADHERENCE_NOTE, COMPLIANCE_HELP, MISSED_HELP } from "@/lib/analytics"
import { Adherence } from "@/types/analytics"

async function loadProgress() {
  try {
    const { data } = await getMyProgress()
    return data ?? null
  } catch {
    return null
  }
}

function AdherenceCard({ title, adherence }: { title: string, adherence: Adherence }) {
  const due = adherence.logged + adherence.missed

  return (
    <div className="flex items-center gap-4">
      <ComplianceRing value={adherence.compliance} label={title} />
      <div>
        <p className="m-0 font-medium">{title}</p>
        <p className="text-muted-foreground m-0">
          {due === 0 ? "Nothing due yet" : `${adherence.logged} logged, ${adherence.missed} missed`}
        </p>
      </div>
    </div>
  )
}

export default async function Progress() {

  const progress = await loadProgress()

  if (!progress) {
    return (
      <div>
        <PageHeader heading="Progress" />
        <EmptyState icon={ChartLineUpIcon} title="Progress is unavailable" description="We could not load your progress. Try again shortly." />
      </div>
    )
  }

  const { program, phase, compliance, streak, volume, nextSession, recentLogs } = progress
  const hasTrend = compliance.trend.some((p) => p.compliance !== null)
  const hasVolume = volume.some((v) => v.reps > 0 || v.sets > 0)

  return (
    <div className="flex flex-col gap-5">
      <PageHeader heading="Progress" subHeading="How consistently you are logging your training">
        <Badge variant={streak > 0 ? "default" : "secondary"} className="h-7 gap-1.5 px-3 text-sm" title="Consecutive most recent past sessions with every exercise logged">
          <FireIcon /> {streak > 0 ? `${streak} session streak` : "No streak yet"}
        </Badge>
      </PageHeader>
      <p className="text-muted-foreground m-0 text-xs">{ADHERENCE_NOTE}</p>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Compliance <MetricHelp text={`${COMPLIANCE_HELP} ${MISSED_HELP}`} />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-8">
              <AdherenceCard title="This week" adherence={compliance.week} />
              <AdherenceCard title="Program to date" adherence={compliance.programToDate} />
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground m-0 mb-2 text-xs">Last 8 weeks. Gaps mean nothing was due. Dashed line = 60%.</p>
              {hasTrend
                ? <TrendChart data={compliance.trend} />
                : <EmptyState icon={ChartLineUpIcon} title="No data yet" description="Your trend appears once sessions have passed." />}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">PROGRAM</p>
              {program ? <CardTitle>{program.name}</CardTitle> : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {program ? (
                <>
                  <div className="flex flex-col gap-1">
                    <ProgressBar value={program.progress} label="Program progress" />
                    <p className="text-muted-foreground m-0 text-xs">
                      {Math.round(program.progress)}% elapsed · {format(parseISO(program.startDate), "MMM d")} - {format(parseISO(program.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  {phase ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2"><Badge>{phase.phaseType}</Badge><span>{phase.name}</span></div>
                      <ProgressBar value={phase.progress} label="Phase progress" />
                      <p className="text-muted-foreground m-0 text-xs">{Math.round(phase.progress)}% of phase elapsed</p>
                    </div>
                  ) : <p className="text-muted-foreground m-0">No active phase right now.</p>}
                </>
              ) : (
                <EmptyState icon={TargetIcon} title="No ongoing program" description="Your coach has not started a program for you." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">NEXT SESSION</p>
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <div>
                  <CardTitle>{nextSession.title}</CardTitle>
                  <CardDescription>
                    {format(parseISO(nextSession.date), "EEEE, MMM d")} · {nextSession.exerciseCount} {nextSession.exerciseCount === 1 ? "exercise" : "exercises"}
                  </CardDescription>
                </div>
              ) : (
                <EmptyState icon={CalendarBlankIcon} title="Nothing scheduled" description="Upcoming sessions will show here." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Weekly volume <Badge variant="outline">Approximate</Badge>
              <MetricHelp text="Reps logged per week. Sets = logged set entries. Reps are summed from what you entered; a range like '8-10' counts as 8, so totals are approximate." />
            </CardTitle>
            <CardDescription>Last 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {hasVolume
              ? <VolumeChart data={volume} />
              : <EmptyState icon={BarbellIcon} title="No volume logged yet" description="Log a workout to see your weekly totals." />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentLogs.length === 0 ? (
              <EmptyState icon={ListChecksIcon} title="No logs yet" description="Exercises you log will show up here." />
            ) : recentLogs.map((l, i) => (
              <div key={`${l.loggedAt}-${i}`} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-3">
                  <b className="font-medium">{l.exercise.name}</b>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">{format(parseISO(l.loggedAt), "MMM d, h:mm a")}</span>
                </div>
                <p className="text-muted-foreground m-0">
                  {l.exercise.session.title} · {l.log.length === 0 ? "No sets recorded" : l.log.map((s) => s.reps).join(", ") + " reps"}
                </p>
                {l.notes && <p className="text-muted-foreground m-0 italic">{l.notes}</p>}
                {i < recentLogs.length - 1 && <Separator className="mt-2" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

}
