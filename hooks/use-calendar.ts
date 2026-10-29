'use client'

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getCalendarSessions } from "@/api/session"

export function useCalendarSessions(start: Date, end: Date) {
  return useQuery({
    queryKey: ["calendar", "sessions", start.toISOString(), end.toISOString()],
    queryFn: async () => (await getCalendarSessions(start, end)).data,
    placeholderData: keepPreviousData,
  })
}
