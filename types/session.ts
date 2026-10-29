
import z from "zod"
import { exerciseSchema, CreateExercise } from "@/types/exercise"
import { Exercise } from "@/types/exercise"

export type Session = {
  id: string
  phaseId: string
  title: string
  date: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type SessionWithExercise = Session & { exercise: Exercise[] }

export const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date().min(1, "Date is required"),
  notes: z.string().optional(),
  exercise: z.array(exerciseSchema).min(1, "Add at least one exercise"),
});

export type SessionData = z.infer<typeof sessionSchema>

export type CreateSession = Pick<Session, "phaseId" | "title" | "date" | "notes"> & { exercise: CreateExercise[] }

export type UpdateSession = 
  Partial<Omit<CreateSession, "exercise">>
  & { exercise?: (CreateExercise & { id?: string })[] }