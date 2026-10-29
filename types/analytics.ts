import { PhaseType } from "@/types/phase"

export const REASONS = [
  "NO_ONGOING_PROGRAM",
  "LOW_COMPLIANCE",
  "MISSED_THIS_WEEK",
  "INACTIVE",
  "PROGRAM_ENDING_SOON",
] as const
export type Reason = (typeof REASONS)[number]

/** compliance is null when nothing was due: render as "no data", never 0% */
export type Adherence = { logged: number, missed: number, compliance: number | null }

export type TrendPoint = Adherence & { weekStart: string }

export type DashboardOverview = {
  kpis: {
    totalAthletes: number
    withOngoingProgram: number
    withoutOngoingProgram: number
    teamComplianceThisWeek: number | null
    sessionsToday: number
  }
  needsAttention: { id: string, firstName: string, lastName: string, reasons: Reason[] }[]
  phaseDistribution: Partial<Record<PhaseType, number>>
}

export type DashboardAthlete = {
  id: string
  firstName: string
  lastName: string
  program: { id: string, name: string, startDate: string, endDate: string } | null
  phase: { id: string, name: string, phaseType: PhaseType, startDate: string, endDate: string, progress: number } | null
  week: Adherence
  programToDate: Adherence
  lastLoggedAt: string | null
  reasons: Reason[]
}

export type AthleteProgress = {
  program: { id: string, name: string, startDate: string, endDate: string, progress: number } | null
  phase: { id: string, name: string, phaseType: PhaseType, startDate: string, endDate: string, progress: number } | null
  compliance: {
    week: Adherence
    programToDate: Adherence
    trend: TrendPoint[]
  }
  streak: number
  volume: { weekStart: string, sets: number, reps: number }[]
  nextSession: { id: string, title: string, date: string, exerciseCount: number } | null
  recentLogs: {
    log: { set: number, reps: number }[]
    notes: string | null
    loggedAt: string
    exercise: { name: string, session: { title: string, date: string } }
  }[]
}
