
import { format } from "date-fns"
import { User } from "@/types/users"

export { cn } from "cn"

export function formatName(user: User) {

  return `${user.firstName} ${user.lastName}`

}

export function getInitials(user: User) {
  return `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`
}

export function formatRange({ startDate, endDate }: { startDate: Date, endDate: Date }) {
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
}

export function getGreeting(name?: string, date: Date = new Date()) {
  const hour = date.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return name ? `${greeting}, ${name}` : greeting
}


export function getCurrentDate(date: Date = new Date()) {
  return format(date, "EEEE, MMMM d, yyyy")
}

export function getErrorMessage(error: unknown, fallback: string) {
  return (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
}
