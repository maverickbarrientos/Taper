'use client'

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay,
  isSameMonth, parseISO, startOfDay, startOfMonth, startOfWeek,
} from "date-fns"
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/analytics/empty-state"
import { MetricHelp } from "@/components/analytics/metric-help"
import { useCalendarSessions } from "@/hooks/use-calendar"
import { cn, getErrorMessage } from "@/lib/utils"
import { MISSED_HELP } from "@/lib/analytics"
import { CalendarSession } from "@/types/calendar"
import { PhaseType } from "@/types/phase"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const phaseDot: Record<PhaseType, string> = {
  GENERAL: "bg-chart-1",
  SPECIFIC: "bg-chart-3",
  TAPER: "bg-chart-5",
}

type SessionState = "upcoming" | "complete" | "partial" | "missed"

/** Past sessions: logged = LOGGED; anything else due counts as not logged (same rule as the analytics). */
function sessionState(s: CalendarSession, today: Date): { state: SessionState, logged: number, total: number } {
  const total = s.exercise.length
  const logged = s.exercise.filter((e) => e.status === "LOGGED").length
  const isPast = isBefore(startOfDay(parseISO(s.date)), startOfDay(today))

  if (!isPast) return { state: "upcoming", logged, total }
  if (total > 0 && logged === total) return { state: "complete", logged, total }
  if (logged > 0) return { state: "partial", logged, total }
  return { state: "missed", logged, total }
}

const stateLabel: Record<SessionState, string> = {
  upcoming: "Upcoming",
  complete: "All logged",
  partial: "Partly logged",
  missed: "Not logged",
}

const stateClass: Record<SessionState, string> = {
  upcoming: "bg-secondary text-secondary-foreground",
  complete: "bg-primary/15 text-primary",
  partial: "bg-warning/15 text-warning",
  missed: "bg-destructive/15 text-destructive",
}

function PhaseDot({ type }: { type: PhaseType }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", phaseDot[type])} />
}

function DayDetail({ day, sessions, today }: { day: Date, sessions: CalendarSession[], today: Date }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(day, "EEEE, MMM d")}</CardTitle>
        <CardDescription>
          {sessions.length === 0 ? "No sessions" : `${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sessions.length === 0 ? (
          <EmptyState icon={CalendarBlankIcon} title="Nothing scheduled" description="Select another day to see its sessions." />
        ) : sessions.map((s, i) => {
          const { state, logged, total } = sessionState(s, today)
          return (
            <div key={s.id} className="flex flex-col gap-2">
              {i > 0 && <Separator />}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="m-0 font-medium">{s.title}</p>
                  <p className="text-muted-foreground m-0 flex items-center gap-1.5 text-xs">
                    <PhaseDot type={s.phase.phaseType} /> {s.phase.phaseType} · {s.phase.name}
                  </p>
                </div>
                <Badge className={stateClass[state]}>{stateLabel[state]}</Badge>
              </div>
              {total === 0 ? (
                <p className="text-muted-foreground m-0">No exercises added.</p>
              ) : (
                <>
                  <p className="text-muted-foreground m-0 text-xs">
                    {state === "upcoming" ? `${total} ${total === 1 ? "exercise" : "exercises"}` : `${logged} of ${total} exercises logged`}
                  </p>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {[...s.exercise].sort((a, b) => a.order - b.order).map((e) => (
                      <li key={e.id} className="flex items-center justify-between gap-2">
                        <span>{e.name}</span>
                        <span className="text-muted-foreground whitespace-nowrap text-xs">
                          {e.sets} x {e.reps}
                          {state !== "upcoming" && ` · ${e.status === "LOGGED" ? "logged" : "not logged"}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {s.notes && <p className="text-muted-foreground m-0 italic">{s.notes}</p>}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/program/${s.phase.programId}`} />}>View program</Button>
                <Button size="sm" nativeButton={false} render={<Link href={`/program/session/${s.id}/edit`} />}>Edit session</Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default function SessionCalendar() {
  const today = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(() => startOfMonth(today))
  const [selected, setSelected] = useState(() => startOfDay(today))
  const rangeStart = startOfWeek(month, { weekStartsOn: 1 })
  const rangeEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const { data, isPending, isError, error, isPlaceholderData } = useCalendarSessions(rangeStart, rangeEnd)

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarSession[]>()
    for (const s of data ?? []) {
      const key = format(parseISO(s.date), "yyyy-MM-dd")
      map.set(key, [...(map.get(key) ?? []), s])
    }
    return map
  }, [data])

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd })
  const sessionsOn = (d: Date) => byDay.get(format(d, "yyyy-MM-dd")) ?? []

  if (isError) return <p className="text-destructive">{getErrorMessage(error, "Could not load the calendar.")}</p>

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{format(month, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" onClick={() => { setMonth(startOfMonth(today)); setSelected(startOfDay(today)) }}>Today</Button>
              <Button size="icon-sm" variant="ghost" aria-label="Previous month" onClick={() => setMonth((m) => addMonths(m, -1))}><CaretLeftIcon /></Button>
              <Button size="icon-sm" variant="ghost" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))}><CaretRightIcon /></Button>
            </div>
          </div>
          <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            {(Object.keys(phaseDot) as PhaseType[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5"><PhaseDot type={t} /> {t}</span>
            ))}
            <span className="flex items-center gap-1">Red = past, not logged <MetricHelp text={MISSED_HELP} /></span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? <Skeleton className="h-96" /> : (
            <>
              <div className="grid grid-cols-7 gap-1 pb-1">
                {WEEKDAYS.map((d) => <div key={d} className="text-muted-foreground text-center text-xs">{d}</div>)}
              </div>
              <div className={cn("grid grid-cols-7 gap-1 transition-opacity", isPlaceholderData && "pointer-events-none opacity-50")} aria-busy={isPlaceholderData}>
                {days.map((d) => {
                  const sessions = sessionsOn(d)
                  const inMonth = isSameMonth(d, month)
                  const isSelected = isSameDay(d, selected)
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setSelected(startOfDay(d))}
                      aria-pressed={isSelected}
                      aria-label={`${format(d, "MMMM d")}, ${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}`}
                      className={cn(
                        "flex min-h-14 flex-col items-stretch gap-1 rounded-lg border border-transparent bg-muted/40 p-1 text-left sm:min-h-20 sm:p-1.5 transition-colors hover:bg-muted",
                        !inMonth && "opacity-40",
                        isSelected && "border-primary bg-muted",
                      )}
                    >
                      <span className={cn("flex size-6 items-center justify-center rounded-full text-xs", isSameDay(d, today) && "bg-primary font-semibold text-primary-foreground")}>
                        {format(d, "d")}
                      </span>
                      {sessions.slice(0, 2).map((s) => {
                        const { state } = sessionState(s, today)
                        return (
                          <span key={s.id} className={cn("hidden items-center gap-1 truncate rounded px-1 text-[11px] sm:flex", state === "missed" ? "bg-destructive/15 text-destructive" : "bg-background/60")}>
                            <PhaseDot type={s.phase.phaseType} />
                            <span className="truncate">{s.title}</span>
                          </span>
                        )
                      })}
                      {sessions.length > 0 && (
                        <span className="flex flex-wrap gap-0.5 px-0.5 sm:hidden">
                          {sessions.slice(0, 3).map((s) => <PhaseDot key={s.id} type={s.phase.phaseType} />)}
                        </span>
                      )}
                      {sessions.length > 2 && <span className="text-muted-foreground hidden px-1 text-[11px] sm:inline">+{sessions.length - 2} more</span>}
                    </button>
                  )
                })}
              </div>
              {data.length === 0 && (
                <EmptyState icon={CalendarBlankIcon} title={`No sessions in ${format(month, "MMMM yyyy")}`} description="Try another month, or add sessions to a program." />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isPending ? <Skeleton className="h-64" /> : <DayDetail day={selected} sessions={sessionsOn(selected)} today={today} />}
    </div>
  )
}
