
import api from "@/lib/api";
import { CreateUserPayload } from "@/features/auth/auth.interface";

export async function createAccount(payload: CreateUserPayload) {

  console.log(payload)

  const response = await api.post('/api/user/create', payload);

  return response.data;

}