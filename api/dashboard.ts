import api from "@/lib/api/client"
import serverApi from "@/lib/api/server"
import { Response } from "@/types/common"
import { DashboardOverview, DashboardAthlete, TrendPoint, AthleteProgress } from "@/types/analytics"

export async function getDashboardOverview(): Promise<Response<DashboardOverview>> {
  const response = await api.get('/dashboard/overview')
  return response.data
}

export async function getDashboardAthletes(): Promise<Response<DashboardAthlete[]>> {
  const response = await api.get('/dashboard/athletes')
  return response.data
}

export async function getDashboardTrend(weeks = 8, athleteId?: string): Promise<Response<TrendPoint[]>> {
  const response = await api.get('/dashboard/trend', { params: { weeks, athleteId } })
  return response.data
}

export async function getMyProgress(): Promise<Response<AthleteProgress>> {
  const response = await serverApi.get('/dashboard/me/progress')
  return response.data
}
