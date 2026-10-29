import { PhaseType, PhaseStatus } from "@/types/phase"
import { Exercise } from "@/types/exercise"

export type CalendarExercise = Omit<Exercise, "notes"> & {
  notes: string | null
  status: "PENDING" | "LOGGED" | "MISSED"
}

export type CalendarSession = {
  id: string
  phaseId: string
  title: string
  date: string
  notes: string | null
  createdAt: string
  updatedAt: string
  phase: { id: string, name: string, phaseType: PhaseType, status: PhaseStatus, programId: string }
  exercise: CalendarExercise[]
}
