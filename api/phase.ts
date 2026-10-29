
import api from "@/lib/api/client";
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
