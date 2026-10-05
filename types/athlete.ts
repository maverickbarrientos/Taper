
import { Events } from "@/types/events";

export const LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "ELITE",
] as const;

export type Level = (typeof LEVELS)[number]

export const GOAL_TYPES = [
  "COMPETITION",
  "LIFESTYLE",
  "WEIGHT_LOSS",
  "STRENGTH",
  "PERFORMANCE",
  "REHAB",
] as const;

export type GoalType = (typeof GOAL_TYPES)[number];

export interface AthleteProfileCreate {
  athleteId:  string
  birthDate:  Date
  heightCm:   number
  weightKg:   number
}

export interface AthleteProficiencyCreate {
  athleteId:    string          
  event:        Events[]
  otherEvent:   string[]        
  level:        Level
  goal:         GoalType[]
}