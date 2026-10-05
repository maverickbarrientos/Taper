

export interface CreateUser {
  firstName: string
  lastName: string
  email: string
  role: "COACH" |  "ATHLETE"
}

export interface CreateUserPayload extends CreateUser {
  clerkId: string
}

export interface CreateUserFormPayload extends CreateUser {
  password: string
}