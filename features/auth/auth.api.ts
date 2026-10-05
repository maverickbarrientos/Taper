
import api from "@/lib/api";
import { CreateUserFormPayload, CreateUserPayload } from "@/features/auth/auth.interface";

export async function createAccount(payload: CreateUserFormPayload) {

  console.log(payload)

  const response = await api.post('/user/create', payload);

  return response.data;

}

export async function syncUserInformation(payload: CreateUserPayload) {
  const response = await api.post('/user/sync', payload)
  return response

}