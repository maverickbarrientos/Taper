
import api from "@/lib/api/client";
import serverApi from "@/lib/api/server";
import { Response } from "@/types/common";
import { CreatePhase, PhaseWithSessions, UpdatePhase } from "@/types/phase";

export async function addPhaseToProgram(data: CreatePhase) {

  const response = await api.post('/program/phase/create', data);
  return response.data;

}

export async function getPhase(phaseId: string): Promise<Response<PhaseWithSessions>> {

  const response = await api.get(`/program/phase/${phaseId}`);
  return response.data

}

export async function updatePhase(phaseId: string, data: UpdatePhase) {

  const response = await api.patch(`/program/phase/${phaseId}`, data);
  return response.data;

}

export async function deletePhase(phaseId: string) {

  const response = await api.delete(`/program/phase/${phaseId}`);
  return response.data;

}

// For server components (the browser client has no session on the server)
export async function getPhaseDetails(phaseId: string): Promise<Response<PhaseWithSessions>> {

  const response = await serverApi.get(`/program/phase/${phaseId}`);
  return response.data

}
