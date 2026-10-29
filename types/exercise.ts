
import z from "zod"

export type Exercise = {
  id: string
  sessionId: string
  name: string
  sets: string
  reps: string
  order: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type CreateExercise = Pick<Exercise, "name" | "sets" | "reps" | "order" | "notes">

export const exerciseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  sets: z.string().min(1, "Sets is required"),
  reps: z.string().min(1, "Reps is required"),
  order: z.number(),
  notes: z.string().optional(),
});

export type ExerciseData = z.infer<typeof exerciseSchema>

export const logExerciseSchema = z.object({
  exerciseId: z.string().min(1, "Select an exercise"),
  log: z.array(
    z.object({ 
      set: z.string().min(1, "Set is required"), 
      reps: z.string().min(1, "Reps is required") 
    })
  ),
  notes: z.string().optional(),
});

export type LogExerciseData = z.infer<typeof logExerciseSchema>