'use client'

import { useMemo, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow, parseISO } from "date-fns"
import { CaretDownIcon, CaretUpIcon, ChartLineUpIcon, CheckCircleIcon, UsersThreeIcon, WarningIcon } from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ComplianceBadge } from "@/components/analytics/compliance-badge"
import { EmptyState } from "@/components/analytics/empty-state"
import { Hint, MetricHelp } from "@/components/analytics/metric-help"
import { ProgressBar } from "@/components/analytics/progress-bar"
import { ReasonChip } from "@/components/analytics/reason-chip"
import { TrendChart } from "@/components/analytics/trend-chart"
import { useDashboardAthletes, useDashboardOverview, useDashboardTrend } from "@/hooks/use-dashboard"
import { ADHERENCE_NOTE, COMPLIANCE_HELP, MISSED_HELP } from "@/lib/analytics"
import { getErrorMessage } from "@/lib/utils"
import { DashboardAthlete } from "@/types/analytics"
import { PHASE_TYPES } from "@/types/phase"

function KpiCard({ label, help, children }: { label: string, help?: string, children: React.ReactNode }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center gap-1">
          {label}
          {help && <MetricHelp text={help} />}
        </CardDescription>
        <CardTitle className="text-2xl">{children}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function Kpis() {
  const { data, isPending, isError, error } = useDashboardOverview()

  if (isPending) return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
  if (isError) return <p className="text-destructive">{getErrorMessage(error, "Could not load overview.")}</p>

  const { kpis, needsAttention, phaseDistribution } = data
  const phaseTotal = PHASE_TYPES.reduce((sum, t) => sum + (phaseDistribution[t] ?? 0), 0)

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Athletes">{kpis.totalAthletes}</KpiCard>
        <KpiCard label="On an ongoing program" help="Athletes with a program currently running.">
          {kpis.withOngoingProgram}
          <span className="text-muted-foreground ml-2 text-sm font-normal">{kpis.withoutOngoingProgram} without</span>
        </KpiCard>
        <KpiCard label="Team compliance this week" help={`Pooled across the team: total logged ÷ total due, not an average of athletes. ${COMPLIANCE_HELP}`}>
          {kpis.teamComplianceThisWeek === null
            ? <span className="text-muted-foreground text-base font-normal">No data</span>
            : `${kpis.teamComplianceThisWeek}%`}
        </KpiCard>
        <KpiCard label="Sessions today" help="All sessions scheduled today (UTC+8).">{kpis.sessionsToday}</KpiCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><WarningIcon /> Needs attention</CardTitle>
            <CardDescription>Athletes with the most flags first.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {needsAttention.length === 0 ? (
              <EmptyState icon={CheckCircleIcon} title="Nobody needs attention" description="No athletes are currently flagged." />
            ) : needsAttention.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3">
                <Link href={`/athletes/${a.id}`} className="font-medium hover:underline">{a.firstName} {a.lastName}</Link>
                <div className="flex flex-wrap justify-end gap-1">
                  {a.reasons.map((r) => <ReasonChip key={r} reason={r} />)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phase distribution</CardTitle>
            <CardDescription>Athletes by current phase type.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {phaseTotal === 0 ? (
              <EmptyState icon={UsersThreeIcon} title="No athletes in a phase" description="Athletes appear here once a phase is ongoing." />
            ) : PHASE_TYPES.filter((t) => phaseDistribution[t]).map((t) => (
              <div key={t} className="flex flex-col gap-1">
                <div className="flex justify-between"><span>{t}</span><span className="text-muted-foreground">{phaseDistribution[t]}</span></div>
                <ProgressBar value={((phaseDistribution[t] ?? 0) / phaseTotal) * 100} label={`${t} share of athletes`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function TeamTrend({ athletes }: { athletes: DashboardAthlete[] }) {
  const [weeks, setWeeks] = useState(8)
  const [athleteId, setAthleteId] = useState("")
  const { data, isPending, isError, error } = useDashboardTrend(weeks, athleteId || undefined)

  const selectClass = "h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
  const hasData = data?.some((p) => p.compliance !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLineUpIcon /> Weekly compliance <MetricHelp text={`${COMPLIANCE_HELP} The current week only counts sessions already past, so it can shift.`} />
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2">
          <select aria-label="Athlete" className={selectClass} value={athleteId} onChange={(e) => setAthleteId(e.target.value)}>
            <option value="">Whole team</option>
            {athletes.map((a) => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
          </select>
          <select aria-label="Weeks" className={selectClass} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>
            {[4, 8, 12, 26].map((w) => <option key={w} value={w}>Last {w} weeks</option>)}
          </select>
          <span className="text-xs">Dashed line = 60% threshold. Gaps mean nothing was due.</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? <Skeleton className="h-56" />
          : isError ? <p className="text-destructive">{getErrorMessage(error, "Could not load trend.")}</p>
          : !hasData ? <EmptyState icon={ChartLineUpIcon} title="No data yet" description="Nothing was due in this period." />
          : <TrendChart data={data} />}
      </CardContent>
    </Card>
  )
}

type SortKey = "name" | "week" | "programToDate" | "lastLoggedAt"

function sortValue(a: DashboardAthlete, key: SortKey): string | number | null {
  switch (key) {
    case "name": return `${a.firstName} ${a.lastName}`.toLowerCase()
    case "week": return a.week.compliance
    case "programToDate": return a.programToDate.compliance
    case "lastLoggedAt": return a.lastLoggedAt ? parseISO(a.lastLoggedAt).getTime() : null
  }
}

function SortHead({ label, k, sort, onSort, help }: { label: string, k: SortKey, sort: { key: SortKey, dir: 1 | -1 }, onSort: (k: SortKey) => void, help?: string }) {
  const active = sort.key === k
  return (
    <TableHead aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <span className="inline-flex items-center gap-1">
        <button type="button" className="inline-flex items-center gap-1 uppercase" onClick={() => onSort(k)}>
          {label}
          {active && (sort.dir === 1 ? <CaretUpIcon size={12} /> : <CaretDownIcon size={12} />)}
        </button>
        {help && <MetricHelp text={help} />}
      </span>
    </TableHead>
  )
}

function AthleteTable({ athletes }: { athletes: DashboardAthlete[] }) {
  const [sort, setSort] = useState<{ key: SortKey, dir: 1 | -1 }>({ key: "name", dir: 1 })

  const rows = useMemo(() => [...athletes].sort((a, b) => {
    const av = sortValue(a, sort.key), bv = sortValue(b, sort.key)
    // null (no data / never logged) always sorts last regardless of direction
    if (av === null && bv === null) return 0
    if (av === null) return 1
    if (bv === null) return -1
    return (av < bv ? -1 : av > bv ? 1 : 0) * sort.dir
  }), [athletes, sort])

  const onSort = (key: SortKey) => setSort((s) => s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 })

  if (athletes.length === 0) {
    return <EmptyState icon={UsersThreeIcon} title="No athletes yet" description="Add an athlete to start tracking adherence." />
  }

  return (
    <Table className="min-w-[44rem]">
      <TableHeader>
        <TableRow>
          <SortHead label="Athlete" k="name" sort={sort} onSort={onSort} />
          <TableHead>PROGRAM / PHASE</TableHead>
          <SortHead label="This week" k="week" sort={sort} onSort={onSort} help={`${COMPLIANCE_HELP} ${MISSED_HELP}`} />
          <SortHead label="Program to date" k="programToDate" sort={sort} onSort={onSort} help={COMPLIANCE_HELP} />
          <SortHead label="Last logged" k="lastLoggedAt" sort={sort} onSort={onSort} />
          <TableHead>FLAGS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((a) => (
          <TableRow key={a.id} className={a.reasons.length > 0 ? "bg-destructive/5" : undefined}>
            <TableCell>
              <Link href={`/athletes/${a.id}`} className="font-medium hover:underline">{a.firstName} {a.lastName}</Link>
            </TableCell>
            <TableCell>
              {a.program ? (
                <div className="flex min-w-40 flex-col gap-1">
                  <span>{a.program.name}</span>
                  {a.phase ? (
                    <>
                      <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Badge variant="secondary">{a.phase.phaseType}</Badge> {a.phase.name}
                      </span>
                      <Hint text={`${Math.round(a.phase.progress)}% of the phase date range has elapsed`}>
                        <ProgressBar value={a.phase.progress} label={`${a.phase.name} progress`} />
                      </Hint>
                    </>
                  ) : <span className="text-muted-foreground text-xs">No active phase</span>}
                </div>
              ) : <span className="text-muted-foreground">No ongoing program</span>}
            </TableCell>
            <TableCell><ComplianceBadge adherence={a.week} /></TableCell>
            <TableCell><ComplianceBadge adherence={a.programToDate} /></TableCell>
            <TableCell>
              {a.lastLoggedAt
                ? <span title={a.lastLoggedAt}>{formatDistanceToNow(parseISO(a.lastLoggedAt), { addSuffix: true })}</span>
                : <span className="text-muted-foreground">Never logged</span>}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {a.reasons.map((r) => <ReasonChip key={r} reason={r} />)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function CoachDashboard() {
  const athletes = useDashboardAthletes()

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="text-muted-foreground m-0 text-xs">{ADHERENCE_NOTE}</p>
      <Kpis />
      <TeamTrend athletes={athletes.data ?? []} />
      <Card>
        <CardHeader>
          <CardTitle>Athletes</CardTitle>
          <CardDescription>Click a column header to sort. Rows with flags are highlighted.</CardDescription>
        </CardHeader>
        <CardContent>
          {athletes.isPending ? <Skeleton className="h-48" />
            : athletes.isError ? <p className="text-destructive">{getErrorMessage(athletes.error, "Could not load athletes.")}</p>
            : <AthleteTable athletes={athletes.data} />}
        </CardContent>
      </Card>
    </div>
  )
}
