
import { z } from "zod";
import { EVENTS } from "@/types/events";
import { LEVELS, GOAL_TYPES } from "@/types/athlete";

const measurement = (label: string, min: number, max: number) =>
  z
    .number({ error: `Enter your ${label}.` })
    .min(min, `That ${label} looks too low.`)
    .max(max, `That ${label} looks too high.`);

export const athleteOnboardingSchema = z.object({

  // STEP 1 ATHLETE PROFILE
  birthdate: z.date().min(1, "Birthdate is required"),
  height: measurement("height", 100, 250),
  weight: measurement("weight", 30, 250),

  //STEP 2 ATHLETE EVENTS
  events: z.array(z.enum(EVENTS)).min(1, "Select at least one event"),
  otherEvents: z.array(z.string()).optional(),

  //STEP 3 ATHLETE FITNESS LEVEL
  level: z.enum(LEVELS, { error: "Fitness level is required" }),

  //STEP 4 ATHLETE GOALS
  goals: z.array(z.enum(GOAL_TYPES)).min(1, "Select at least one goal"),

});

export type AthleteOnboardingData = z.infer<typeof athleteOnboardingSchema>

export const athleteProfileSchema = athleteOnboardingSchema.pick({
  birthdate: true,
  weight: true,
  height: true
});

export const athleteEventsSchema = athleteOnboardingSchema.pick({
  events: true,
  otherEvents: true,
});


export const athleteFitnessLevelSchema = athleteOnboardingSchema.pick({
  level: true,
});


export const athleteGoalsSchema = athleteOnboardingSchema.pick({
  goals: true,
});

export const stepSchemas = [
  athleteProfileSchema,
  athleteEventsSchema,
  athleteFitnessLevelSchema,
  athleteGoalsSchema,
] as const;

export type AthleteProfileData = z.infer<typeof athleteProfileSchema>;
export type AthleteEventsData = z.infer<typeof athleteEventsSchema>;
export type AthleteFitnesssLevelData = z.infer<typeof athleteEventsSchema>;
export type AthleteGoalsData = z.infer<typeof athleteGoalsSchema>