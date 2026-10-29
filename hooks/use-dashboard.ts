'use client'

import { useQuery } from "@tanstack/react-query"
import { getDashboardOverview, getDashboardAthletes, getDashboardTrend } from "@/api/dashboard"

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => (await getDashboardOverview()).data,
  })
}

export function useDashboardAthletes() {
  return useQuery({
    queryKey: ["dashboard", "athletes"],
    queryFn: async () => (await getDashboardAthletes()).data,
  })
}

export function useDashboardTrend(weeks: number, athleteId?: string) {
  return useQuery({
    queryKey: ["dashboard", "trend", weeks, athleteId ?? "team"],
    queryFn: async () => (await getDashboardTrend(weeks, athleteId)).data,
  })
}
