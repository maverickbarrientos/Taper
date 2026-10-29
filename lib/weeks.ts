import { differenceInCalendarDays } from "date-fns"

export function getWeekInfo(
  start: Date,
  end: Date,
  weekParam?: string | null,
  today: Date = new Date()
) {
  const totalWeeks = Math.ceil((differenceInCalendarDays(end, start) + 1) / 7)
  const clamp = (n: number) => Math.min(Math.max(n, 1), totalWeeks)

  const todayWeek = clamp(Math.floor(differenceInCalendarDays(today, start) / 7) + 1)
  const requested = Number.parseInt(weekParam ?? "", 10)
  const week = Number.isNaN(requested) ? todayWeek : clamp(requested)

  return { totalWeeks, todayWeek, week }
}