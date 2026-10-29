import { Reason } from "@/types/analytics"

export const LOW_COMPLIANCE_THRESHOLD = 60

export const COMPLIANCE_HELP =
  "Compliance = logged ÷ (logged + missed). Only exercises already due (session date in the past) count. Shown as \"No data\" when nothing was due."

export const MISSED_HELP =
  "Missed = a due exercise that was not logged. This includes exercises still pending after their session date."

export const ADHERENCE_NOTE =
  "Adherence only measures whether prescribed exercises were logged. It does not track weight, RPE, reps vs. plan, or when a log was made."

export const REASON_META: Record<Reason, { label: string, description: string }> = {
  NO_ONGOING_PROGRAM: { label: "No program", description: "Has no ongoing program." },
  LOW_COMPLIANCE: { label: "Low compliance", description: `Program-to-date compliance is under ${LOW_COMPLIANCE_THRESHOLD}%.` },
  MISSED_THIS_WEEK: { label: "Missed this week", description: "Has at least one due exercise not logged this week." },
  INACTIVE: { label: "Inactive", description: "Has a program but has not logged in 5 days (or ever)." },
  PROGRAM_ENDING_SOON: { label: "Ending soon", description: "Program ends within 14 days." },
}

export type ComplianceTone = "none" | "low" | "mid" | "high"

export function complianceTone(value: number | null): ComplianceTone {
  if (value === null) return "none"
  if (value < LOW_COMPLIANCE_THRESHOLD) return "low"
  if (value < 80) return "mid"
  return "high"
}

export function formatCompliance(value: number | null) {
  return value === null ? "No data" : `${value}%`
}
