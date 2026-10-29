
import api from "@/lib/api/client";
import serverApi from "@/lib/api/server";
import { User, UserCreate, AthleteWithPrograms, AthleteProfile, UpdateUser } from "@/types/users";
import { Response } from "@/types/common";

export async function getAllAthletes(): Promise<Response<User[]>> {

  const response = await serverApi.get('/users/athletes', { params: { role: "ATHLETE" } });
  return response.data;

}

export async function createAthlete(data: UserCreate) {

  const response = await api.post('/users/athletes/create', data);
  return response.data

}

export async function getAthleteDetails(id: string): Promise<Response<AthleteWithPrograms>> {

  const response = await serverApi.get(`/users/athletes/${id}`);
  return response.data;

}
export async function getAthleteProfile(): Promise<Response<AthleteProfile>> {

  const response = await serverApi.get('/users/me');
  return response.data;

}

export async function getCoachProfile(): Promise<Response<User>> {

  const response = await serverApi.get('/users/me');
  return response.data;

}

export async function updateMyProfile(data: UpdateUser): Promise<Response<User>> {

  const response = await api.patch('/users/me', data);
  return response.data;

}

export async function updateAthlete(id: string, data: UpdateUser): Promise<Response<User>> {

  const response = await api.patch(`/users/athletes/${id}`, data);
  return response.data;

}

export async function deleteAthlete(id: string) {

  const response = await api.delete(`/users/athletes/${id}`);
  return response.data;

}
