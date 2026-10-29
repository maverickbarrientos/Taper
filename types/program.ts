
import z from "zod"
import { User } from "@/types/users"
import { PhaseWithSessions } from "@/types/phase"
import { AISummary } from "@/types/ai-summary"

export type ProgramStatus = "ONGOING" | "COMPLETED" | "SKIPPED"

export type Program = {
  id: string
  name: string
  date: Date
  status: ProgramStatus
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export type ProgramSummary = Program & {
  athleteId: string
  progress: number
  totals: {
    phases: number
    sessions: number
    completedSessions: number
    exercises: number
    loggedExercises: number
  }
}

export type ProgramWithAthlete = Program & { athlete: User }

export type ProgramWithPhaseAndSession = ProgramWithAthlete & { phase: PhaseWithSessions[], aiSummary: AISummary[] }

export type CreateProgram = 
  Pick<Program, "name" | "date" | "startDate" | "endDate">
  & { athleteId: string }

export type UpdateProgram = Partial<Program>

export const programSchema = z.object({
  athleteId: z.string().min(1, "Athlete is required"),
  name: z.string().min(1, "Program title is required"),
  date: z.date().min(1, "Date is required"),
  startDate: z.date().min(1, "Start date is required"),
  endDate: z.date().min(1, "End date is required"),
});

export type ProgramData = z.infer<typeof programSchema>