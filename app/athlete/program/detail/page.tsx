import Link from "next/link"
import { format, parseISO, startOfDay, isBefore } from "date-fns"
import { ArrowLeftIcon, CaretDownIcon, CalendarBlankIcon, SparkleIcon, TargetIcon } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PageHeader from "@/components/page-header"
import { EmptyState } from "@/components/analytics/empty-state"
import { MetricHelp } from "@/components/analytics/metric-help"
import { ProgressBar } from "@/components/analytics/progress-bar"
import { getMyProgramDetail } from "@/api/program"
import { MISSED_HELP } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { DetailExercise, DetailPhase, DetailSession } from "@/types/program-detail"

async function loadDetail() {
  try {
    const { data } = await getMyProgramDetail()
    return data ?? null
  } catch {
    return null
  }
}

const range = (start: string, end: string) => `${format(parseISO(start), "MMM d")} - ${format(parseISO(end), "MMM d, yyyy")}`

type ExerciseState = "upcoming" | "logged" | "not-logged"

/** Same rule as the analytics: a due exercise that isn't LOGGED counts as not logged. */
function exerciseState(exercise: DetailExercise, sessionDate: string): ExerciseState {
  if (exercise.status === "LOGGED") return "logged"
  return isBefore(startOfDay(parseISO(sessionDate)), startOfDay(new Date())) ? "not-logged" : "upcoming"
}

const stateBadge: Record<ExerciseState, { label: string, className: string }> = {
  logged: { label: "Logged", className: "bg-primary/15 text-primary" },
  "not-logged": { label: "Not logged", className: "bg-destructive/15 text-destructive" },
  upcoming: { label: "Upcoming", className: "bg-secondary text-secondary-foreground" },
}

function ExerciseRow({ exercise, sessionDate }: { exercise: DetailExercise, sessionDate: string }) {
  const state = exerciseState(exercise, sessionDate)
  const { label, className } = stateBadge[state]

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <b className="font-medium">{exercise.name}</b>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground whitespace-nowrap">{`${exercise.sets} x ${exercise.reps}`}</span>
          <Badge className={className}>{label}</Badge>
        </div>
      </div>
      {exercise.notes && <p className="text-muted-foreground m-0 text-xs">{exercise.notes}</p>}
      {exercise.log && (
        <div className="bg-muted/40 flex flex-col gap-0.5 rounded-lg p-2 text-xs">
          {exercise.log.log.length > 0 ? (
            <p className="m-0">{exercise.log.log.map((s) => `Set ${s.set}: ${s.reps} reps`).join(" · ")}</p>
          ) : (
            <p className="text-muted-foreground m-0">No sets recorded.</p>
          )}
          {exercise.log.notes && <p className="text-muted-foreground m-0 italic">{exercise.log.notes}</p>}
          <p className="text-muted-foreground m-0">Logged {format(parseISO(exercise.log.loggedAt), "MMM d, h:mm a")}</p>
        </div>
      )}
    </div>
  )
}

function SessionRow({ session }: { session: DetailSession }) {
  const total = session.exercise.length
  const logged = session.exercise.filter((e) => e.status === "LOGGED").length

  return (
    <details className="group rounded-lg bg-muted/30">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3">
        <div>
          <p className="m-0 font-medium">{session.title}</p>
          <p className="text-muted-foreground m-0 text-xs">
            {format(parseISO(session.date), "EEE, MMM d")} · {total === 0 ? "No exercises" : `${logged} of ${total} logged`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{session.status}</Badge>
          <CaretDownIcon className="text-muted-foreground transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div className="flex flex-col gap-3 px-3 pb-3">
        <Separator />
        {session.notes && <p className="text-muted-foreground m-0 italic">{session.notes}</p>}
        {total === 0
          ? <p className="text-muted-foreground m-0">No exercises added to this session yet.</p>
          : [...session.exercise].sort((a, b) => a.order - b.order).map((e) => (
            <ExerciseRow key={e.id} exercise={e} sessionDate={session.date} />
          ))}
      </div>
    </details>
  )
}

function PhaseCard({ phase }: { phase: DetailPhase }) {
  const isOngoing = phase.status === "ONGOING"
  const sessions = [...phase.session].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

  return (
    <Card className={cn(isOngoing && "ring-2 ring-primary")}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge>{phase.phaseType}</Badge>
          <Badge variant={isOngoing ? "default" : "outline"}>{phase.status}</Badge>
        </div>
        <CardTitle>{phase.name}</CardTitle>
        <CardDescription>{range(phase.startDate, phase.endDate)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <ProgressBar value={phase.progress} label={`${phase.name} progress`} />
          <p className="text-muted-foreground m-0 text-xs">{Math.round(phase.progress)}% of phase elapsed</p>
        </div>
        {sessions.length === 0
          ? <p className="text-muted-foreground m-0">No sessions scheduled in this phase yet.</p>
          : sessions.map((s) => <SessionRow key={s.id} session={s} />)}
      </CardContent>
    </Card>
  )
}

export default async function ProgramDetailPage() {

  const detail = await loadDetail()

  const back = (
    <Button variant="outline" nativeButton={false} render={<Link href="/athlete/program" />}>
      <ArrowLeftIcon /> All programs
    </Button>
  )

  if (!detail) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeader heading="Program">{back}</PageHeader>
        <Card>
          <CardContent>
            <EmptyState icon={TargetIcon} title="No ongoing program" description="Once your coach starts a program, its full breakdown will show here." />
          </CardContent>
        </Card>
      </div>
    )
  }

  const { program, phases, latestSummary } = detail
  const { totals } = program
  const stats = [
    { label: "Phases", value: totals.phases },
    { label: "Sessions done", value: `${totals.completedSessions}/${totals.sessions}` },
    { label: "Exercises logged", value: `${totals.loggedExercises}/${totals.exercises}`, help: MISSED_HELP },
  ]

  return (
    <div className="flex flex-col gap-5">
      <PageHeader heading={program.name} subHeading={`${range(program.startDate, program.endDate)} · Competition ${format(parseISO(program.date), "MMM d, yyyy")}`} badge badgeName={program.status}>
        {back}
      </PageHeader>

      <div className="grid items-stretch gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <ProgressBar value={program.progress} label="Program progress" />
              <p className="text-muted-foreground m-0 text-xs">{Math.round(program.progress)}% of program elapsed</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ label, value, help }) => (
                <div key={label}>
                  <p className="m-0 text-lg font-semibold">{value}</p>
                  <p className="text-muted-foreground m-0 flex items-center gap-1 text-xs">{label}{help && <MetricHelp text={help} />}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><SparkleIcon /> Weekly summary</CardTitle>
            <CardDescription>
              {latestSummary ? `Week of ${format(parseISO(latestSummary.weekStart), "MMM d, yyyy")}` : "Generated by AI"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestSummary
              ? <p className="text-muted-foreground m-0 text-sm">{latestSummary.content}</p>
              : <EmptyState icon={SparkleIcon} title="No summary yet" description="Your first weekly summary will appear here." />}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <b>PHASES</b>
        {phases.length === 0
          ? <Card><CardContent><EmptyState icon={CalendarBlankIcon} title="No phases yet" description="Your coach has not added any phases to this program." /></CardContent></Card>
          : phases.map((p) => <PhaseCard key={p.id} phase={p} />)}
      </div>
    </div>
  )

}
