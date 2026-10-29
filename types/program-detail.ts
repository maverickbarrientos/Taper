import { ProgramStatus } from "@/types/program"
import { AISummary } from "@/types/ai-summary"

export type DetailExerciseLog = {
  log: { set: string, reps: string }[]
  notes: string | null
  loggedAt: string
}

export type DetailExercise = {
  id: string
  sessionId: string
  name: string
  sets: string
  reps: string
  order: number
  notes: string | null
  status: "PENDING" | "LOGGED" | "MISSED"
  log: DetailExerciseLog | null
}

export type DetailSession = {
  id: string
  phaseId: string
  title: string
  date: string
  notes: string | null
  status: string
  exercise: DetailExercise[]
}

export type DetailPhase = {
  id: string
  programId: string
  name: string
  // The API can return types outside PHASE_TYPES (e.g. HYPERTROPHY), so keep this open.
  phaseType: string
  status: string
  startDate: string
  endDate: string
  progress: number
  session: DetailSession[]
}

export type ProgramDetail = {
  program: {
    id: string
    athleteId: string
    name: string
    date: string
    status: ProgramStatus
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
    progress: number
    totals: {
      phases: number
      sessions: number
      completedSessions: number
      exercises: number
      loggedExercises: number
    }
  }
  phases: DetailPhase[]
  latestSummary: (AISummary & { weekStart: string }) | null
}
