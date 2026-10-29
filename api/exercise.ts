
import api from "@/lib/api/client";
import { CreateExercise, LogExerciseData } from "@/types/exercise"

export async function createExercises(data: CreateExercise[]) {

  const response = await api.post('/exercise/create', data);
  return response.data

}

export async function logExercise(data: LogExerciseData) {

  const response = await api.post('/exercise/log', data);
  return response.data;

}