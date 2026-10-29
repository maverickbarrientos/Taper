
import axios from "axios"
import { createClient } from "@/lib/supabase/server"

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const token = session?.access_token

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
});

export default api