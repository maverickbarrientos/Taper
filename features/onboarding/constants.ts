
import { Level } from "@/types/athlete";

export const ATHLETE_FITNESS_LEVEL: Record<Level, { title: string, description: string }> = {
  BEGINNER: { 
    title: "Beginner",
    description: "New structured training or returning after a long break"
  }, 
  INTERMEDIATE: {
    title: "Intermediate",
    description: "Train regularly and have competed or tested yourself",
  },
  ADVANCED: {
    title: "Advanced",
    description: "Train year-round and compete at high level"
  },
  ELITE: {
    title: "Elite",
    description: "Compete at a national or international level, often with a coach and a full-time training schedule",
  },
}