import { UserRole } from "@/types/users"

export const ROLE_HOME: Record<UserRole, string> = {
  COACH: "/dashboard",
  ATHLETE: "/athlete/home",
}

const COACH_PREFIXES = ["/dashboard", "/athletes", "/calendar", "/program", "/profile"]

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function isUserRole(role: unknown): role is UserRole {
  return role === "COACH" || role === "ATHLETE"
}

export function homeForRole(role: unknown) {
  return isUserRole(role) ? ROLE_HOME[role] : null
}

// Which role a route belongs to; null for routes open to every signed-in user.
export function roleForPath(pathname: string): UserRole | null {
  if (matchesPrefix(pathname, "/athlete")) return "ATHLETE"
  if (COACH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))) return "COACH"
  return null
}
