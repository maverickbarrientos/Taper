
export type FormMode<T> = 
  | { mode: "create", data?: never }
  | { mode: "update", data: T }

export type Response<T> = { message: string, success: boolean, data: T }