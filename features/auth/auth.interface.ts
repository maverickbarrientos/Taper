

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "COACH" | "ATHLETE"
}