
import z from "zod"
import { SessionWithExercise } from "@/types/session"

export const PHASE_TYPES = ["GENERAL", "SPECIFIC", "TAPER"] as const;
export type PhaseType = (typeof PHASE_TYPES)[number]
export type PhaseStatus = "ONGOING" | "COMPLETED" | "SKIPPED"

export type Phase = {
  id: string
  programId: string
  name: string
  phaseType: PhaseType
  startDate: Date
  endDate: Date
  status: PhaseStatus
  createdAt: Date
  updatedAt: Date
}

export type PhaseWithSessions = Phase & {
  session: SessionWithExercise[]
}

export type UpdatePhase = Partial<Phase>;

export const phaseSchema = z.object({
  name: z.string().min(1, "Phase name is required"),
  phaseType: z.enum(PHASE_TYPES),
  startDate: z.date().min(1, "Start date is required"),
  endDate: z.date().min(1, "End date is required"),
});

export type PhaseData = z.infer<typeof phaseSchema>

export type CreatePhase = Pick<Phase, "name" | "phaseType" | "programId" | "startDate" | "endDate">