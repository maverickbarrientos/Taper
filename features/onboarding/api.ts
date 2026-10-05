
import api from "@/lib/api";
import { AthleteProfileCreate, AthleteProficiencyCreate } from "@/types/athlete";

export async function createAthleteProfile(payload: AthleteProfileCreate) {

  const response = await api.post('/user/athlete/create/profile', payload);
  return response;

}

export async function createAthleteProficiency(payload: AthleteProficiencyCreate) {

  const response = await api.post('/user/athlete/create/proficiency', payload);
  return response;

}