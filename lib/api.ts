
import axios from "axios";
import { getAuth } from "@clerk/nextjs/server";


const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(async (config) => {

  const token = await window.Clerk?.session?.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config

});

export default api