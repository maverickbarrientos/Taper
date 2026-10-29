
import api from "@/lib/api/client";
import serverApi from "@/lib/api/server"
import { Response } from "@/types/common";
import { AISummary } from "@/types/ai-summary";
import { ProgramDetail } from "@/types/program-detail";
import { ProgramWithAthlete, ProgramSummary, CreateProgram, ProgramWithPhaseAndSession, UpdateProgram } from "@/types/program";

export async function getAllPrograms(): Promise<Response<ProgramWithAthlete[]>> {
  const response = await serverApi.get('/program');
  return response.data;
}

export async function getProgramDetails(programId: string): Promise<Response<ProgramWithPhaseAndSession>> {
  const response = await serverApi.get(`/program/${programId}`);
  return response.data;
}

export async function createProgram(data: CreateProgram) {
  const response = await api.post('/program/create', data);
  return response.data

}

export async function getAthleteProgram(): Promise<Response<ProgramWithPhaseAndSession>> {
  const response = await serverApi.get('/program/me');
  return response.data;
}

export async function updateProgram(programId: string, data: UpdateProgram) {
  const response = await api.patch(`/program/${programId}`, data);
  return response.data;
}
export async function deleteProgram(programId: string) {
  const response = await api.delete(`/program/${programId}`);
  return response.data;
}

export async function getMyPrograms(): Promise<Response<ProgramSummary[]>> {
  const response = await serverApi.get('/program/me/list');
  return response.data;
}

export async function getMyProgramDetail(): Promise<Response<ProgramDetail>> {
  const response = await serverApi.get('/program/me/detail');
  return response.data;
}

// Creates the summary, or overwrites the current one if it already exists.
export async function generateProgramSummary(programId: string, athleteId: string): Promise<Response<AISummary>> {
  const response = await api.post(`/program/${programId}/summary`, { athleteId });
  return response.data;
}
