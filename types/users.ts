
import z from "zod"
import { Program } from "@/types/program"
import { AISummary } from "@/types/ai-summary"
import { Phase } from "@/types/phase"

export type UserRole = "ATHLETE" | "COACH"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  events: string[]
  goals: string[]
  createdAt: Date
  updatedAt: Date
}

export type UserCreate = Pick<User, "firstName" | "lastName" | "email"> & { events?: string[], goals?: string[] }

export type AthleteWithPrograms = User & { program: (Program & { aiSummary?: AISummary[] })[] }

export type AthleteProfile = User & {
  currentProgram: Program | null
  currentPhase: Phase | null
}

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email().min(1, "Email is required"),
  events: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
})

export type UserData = z.infer<typeof userSchema>

export type UpdateUser = Partial<UserCreate> & { password?: string }

export const userUpdateSchema = userSchema.extend({
  password: z.string()
    .refine((value) => value === "" || value.length >= 8, "Password must be at least 8 characters")
    .optional(),
})

export type UserUpdateData = z.infer<typeof userUpdateSchema>