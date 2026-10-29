import { format, differenceInCalendarDays } from "date-fns"
import {
  CalendarCheckIcon,
  FlagCheckeredIcon,
  BarbellIcon,
  EnvelopeSimpleIcon,
  TimerIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import AthleteFocus from "@/components/athlete-focus"
import { AthleteProfile } from "@/types/users"
import { formatName, getInitials, formatRange } from "@/lib/utils"

function getProgress(startDate: Date | string, endDate: Date | string) {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  if (end <= start) return 100
  return Math.min(Math.max(((Date.now() - start) / (end - start)) * 100, 0), 100)
}

function ProgressBar({ value, label }: { value: number, label: string }) {

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  )

}

type StatTileProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  hint?: string
}

function StatTile({ icon, label, value, hint }: StatTileProps) {

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <p className="m-0 text-xs font-medium tracking-wide">{label}</p>
        </div>
        <div className="text-3xl font-bold leading-none">{value}</div>
        {hint && <p className="m-0 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )

}

type AthleteProfileCardProps = {
  athlete: AthleteProfile
  action?: React.ReactNode
}

export default function AthleteProfileCard({ athlete, action }: AthleteProfileCardProps) {

  const { currentProgram, currentPhase } = athlete

  const daysToGo = currentProgram
    ? differenceInCalendarDays(new Date(currentProgram.date), new Date())
    : null
  const programProgress = currentProgram ? getProgress(currentProgram.startDate, currentProgram.endDate) : 0
  const phaseProgress = currentPhase ? getProgress(currentPhase.startDate, currentPhase.endDate) : 0

  return (
    <div className="space-y-5">

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
        <CardContent className="-mt-12 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar className="size-24 ring-4 ring-card">
              <AvatarFallback className="text-3xl font-bold">{getInitials(athlete)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="m-0">{formatName(athlete)}</h1>
                <Badge>{athlete.role}</Badge>
              </div>
              <p className="m-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                <EnvelopeSimpleIcon />
                {athlete.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-1">
            <p className="m-0 text-xs tracking-wide text-muted-foreground">
              MEMBER SINCE {format(new Date(athlete.createdAt), "MMM yyyy").toUpperCase()}
            </p>
            {action}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-3">
        <StatTile
          icon={<FlagCheckeredIcon />}
          label="COMPETITION"
          value={
            daysToGo === null ? <span className="text-muted-foreground">-</span>
            : daysToGo >= 0 ? <>{daysToGo}<span className="ml-1 text-base font-medium text-muted-foreground">days</span></>
            : <span className="text-xl">Finished</span>
          }
          hint={currentProgram ? format(new Date(currentProgram.date), "EEE, MMM d, yyyy") : "No ongoing program"}
        />
        <StatTile
          icon={<CalendarCheckIcon />}
          label="PROGRAM"
          value={currentProgram ? <>{Math.round(programProgress)}<span className="text-base font-medium text-muted-foreground">%</span></> : <span className="text-muted-foreground">-</span>}
          hint={currentProgram ? "complete" : undefined}
        />
        <StatTile
          icon={<TimerIcon />}
          label="PHASE"
          value={currentPhase ? <span className="text-2xl">{currentPhase.phaseType}</span> : <span className="text-muted-foreground">-</span>}
          hint={currentPhase ? currentPhase.name : "No ongoing phase"}
        />
      </div>

      <AthleteFocus events={athlete.events} goals={athlete.goals} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarbellIcon />
              <p className="m-0 text-xs font-medium tracking-wide">CURRENT PROGRAM</p>
            </div>
            {currentProgram ? (
              <>
                <div className="space-y-1">
                  <b className="text-lg">{currentProgram.name}</b>
                  <p className="m-0 text-sm text-muted-foreground">{formatRange(currentProgram)}</p>
                </div>
                <ProgressBar value={programProgress} label="Program progress" />
              </>
            ) : (
              <p className="m-0 text-sm text-muted-foreground">You don&apos;t have an ongoing program yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TimerIcon />
              <p className="m-0 text-xs font-medium tracking-wide">CURRENT PHASE</p>
            </div>
            {currentPhase ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <b className="text-lg">{currentPhase.name}</b>
                    <Badge variant="outline">{currentPhase.phaseType}</Badge>
                  </div>
                  <p className="m-0 text-sm text-muted-foreground">{formatRange(currentPhase)}</p>
                </div>
                <ProgressBar value={phaseProgress} label="Phase progress" />
              </>
            ) : (
              <p className="m-0 text-sm text-muted-foreground">No phase is in progress right now.</p>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )

}
