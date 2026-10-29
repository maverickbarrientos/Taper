


import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: { "Content-Type": "application/json" }
});


api.interceptors.request.use(async (config) => {

  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Never send "Bearer undefined"; without a token the backend answers 401 itself.
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
});

export default api