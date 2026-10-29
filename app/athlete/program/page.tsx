import Link from "next/link"
import { connection } from "next/server"
import { format, isSameDay, startOfDay } from "date-fns"
import { BarbellIcon, CalendarBlankIcon, TargetIcon, StarIcon } from "@phosphor-icons/react/dist/ssr"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PageHeader from "@/components/page-header"
import LogExerciseModal from "@/components/log-exercise-modal"
import { EmptyState } from "@/components/analytics/empty-state"
import { ProgressBar } from "@/components/analytics/progress-bar"
import { getAthleteProgram, getMyPrograms } from "@/api/program"
import { cn, formatRange } from "@/lib/utils"
import { ProgramSummary } from "@/types/program"
import { SessionWithExercise } from "@/types/session"

async function loadPrograms() {
  try {
    const { data } = await getMyPrograms()
    return data ?? []
  } catch (error) {
    console.error("[athlete/program] GET /program/me/list failed:", (error as { response?: { status?: number, data?: unknown } }).response?.status, (error as { response?: { data?: unknown } }).response?.data ?? error)
    return null
  }
}

async function loadOngoingProgram() {
  try {
    const { data } = await getAthleteProgram()
    return data ?? null
  } catch {
    return null
  }
}

function ProgramStats({ totals }: { totals: ProgramSummary["totals"] }) {

  const stats = [
    { label: "Phases", value: totals.phases },
    { label: "Sessions", value: `${totals.completedSessions}/${totals.sessions}` },
    { label: "Exercises", value: `${totals.loggedExercises}/${totals.exercises}` },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value }) => (
        <div key={label}>
          <p className="m-0 text-lg font-semibold">{value}</p>
          <p className="text-muted-foreground m-0 text-xs">{label}</p>
        </div>
      ))}
    </div>
  )

}

function ProgramCard({ program, featured = false }: { program: ProgramSummary, featured?: boolean }) {

  const isOngoing = program.status === "ONGOING"

  return (
    <Card className={cn(isOngoing && "ring-2 ring-primary", featured && "h-full")}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground m-0 text-xs tracking-wide">
            {featured ? "CURRENT PROGRAM" : "PROGRAM"}
          </p>
          <Badge variant={isOngoing ? "default" : "outline"}>{program.status}</Badge>
        </div>
        <CardTitle className={featured ? "text-xl" : undefined}>{program.name}</CardTitle>
        <CardDescription>
          {formatRange(program)} · Competition {format(new Date(program.date), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <ProgressBar value={program.progress} label={`${program.name} progress`} />
          <p className="text-muted-foreground m-0 text-xs">{Math.round(program.progress)}% elapsed</p>
        </div>
        <ProgramStats totals={program.totals} />
      </CardContent>
      {featured && isOngoing && (
        <CardFooter className="flex justify-end">
          <Button nativeButton={false} render={<Link href="/athlete/program/detail" />}>View full program</Button>
        </CardFooter>
      )}
    </Card>
  )

}

function CurrentSession({ session, phaseType }: { session: SessionWithExercise | null, phaseType?: string }) {

  if (!session) {
    return (
      <Card className="h-full">
        <CardHeader>
          <p className="text-muted-foreground m-0 text-xs tracking-wide">CURRENT SESSION</p>
        </CardHeader>
        <CardContent>
          <EmptyState icon={BarbellIcon} title="No upcoming session" description="Sessions your coach schedules will show here." />
        </CardContent>
      </Card>
    )
  }

  const isToday = isSameDay(new Date(session.date), new Date())

  return (
    <Card className="h-full ring-2 ring-primary">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground m-0 text-xs tracking-wide">
            {isToday ? "TODAY'S SESSION" : "NEXT SESSION"}
          </p>
          {phaseType && <Badge variant="outline">{phaseType}</Badge>}
        </div>
        <CardTitle className="text-xl">{session.title}</CardTitle>
        <CardDescription>
          {format(new Date(session.date), "EEEE, MMM d")} · {session.exercise.length} {session.exercise.length === 1 ? "exercise" : "exercises"}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-3">
        {session.exercise.length > 0 ? session.exercise.map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between gap-3">
            <b className="font-medium">{exercise.name}</b>
            <span className="text-muted-foreground whitespace-nowrap">{`${exercise.sets} x ${exercise.reps}`}</span>
          </div>
        )) : (
          <p className="text-muted-foreground m-0">No exercises added to this session yet.</p>
        )}
      </CardContent>
      {session.exercise.length > 0 && (
        <CardFooter className="flex justify-end">
          <LogExerciseModal session={session} />
        </CardFooter>
      )}
    </Card>
  )

}

export default async function Program() {

  // Per-user data: render on request, never at build time (the loaders below swallow errors)
  await connection()

  const [programs, ongoing] = await Promise.all([loadPrograms(), loadOngoingProgram()])

  if (programs === null) {
    return (
      <div>
        <PageHeader heading="Program" />
        <EmptyState icon={TargetIcon} title="Programs are unavailable" description="We could not load your programs. Try again shortly." />
      </div>
    )
  }

  const current = programs.find((program) => program.status === "ONGOING")
  const others = programs.filter((program) => program.id !== current?.id)

  const today = startOfDay(new Date())
  const phaseOf = (session: SessionWithExercise) => ongoing?.phase.find((phase) => phase.session.some((s) => s.id === session.id))
  const upcoming = (ongoing?.phase ?? [])
    .flatMap((phase) => phase.session)
    .filter((session) => new Date(session.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const currentSession = upcoming[0] ?? null

  return (
    <div className="flex flex-col gap-5">
      <PageHeader heading="Program" subHeading="Your current and past training programs" />

      {current ? (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ProgramCard program={current} featured />
          <CurrentSession session={currentSession} phaseType={currentSession ? phaseOf(currentSession)?.phaseType : undefined} />
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState icon={CalendarBlankIcon} title="No ongoing program" description="Once your coach starts a program, it will be highlighted here." />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <StarIcon className="text-muted-foreground" />
          <b>{current ? "OTHER PROGRAMS" : "ALL PROGRAMS"}</b>
        </div>
        {others.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {others.map((program) => <ProgramCard key={program.id} program={program} />)}
          </div>
        ) : (
          <p className="text-muted-foreground m-0">{current ? "No other programs yet." : "No programs yet."}</p>
        )}
      </div>
    </div>
  )

}
