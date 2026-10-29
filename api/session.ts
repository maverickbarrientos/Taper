
import api from "@/lib/api/client"
import serverApi from "@/lib/api/server"
import { Response } from "@/types/common";
import { CalendarSession } from "@/types/calendar"
import { CreateSession, Session, UpdateSession, SessionWithExercise } from "@/types/session"

export async function getSession(sessionId: string): Promise<Response<SessionWithExercise>> {

  const response = await serverApi.get(`/session/${sessionId}`);
  return response.data;

}

export async function createSession(data: CreateSession): Promise<Response<Session>> {

  const response = await api.post('/session/create', data);
  return response.data;

}

export async function updateSession(sessionId: string, data: UpdateSession) {

  const response = await api.patch(`/session/${sessionId}`, data);
  return response.data;

}

export async function deleteSession(sessionId: string) {

  const response = await api.delete(`/session/${sessionId}`);
  return response.data;

}

export async function getCalendarSessions(start: Date, end: Date): Promise<Response<CalendarSession[]>> {

  const response = await api.get('/session/calendar', { params: { start: start.toISOString(), end: end.toISOString() } });
  return response.data;

}
