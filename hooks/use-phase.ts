'use client'

import { useQuery } from "@tanstack/react-query"
import { getPhase } from "@/api/phase"

export function usePhase(phaseId: string) {

  return useQuery({
    queryKey: ["phase", phaseId],
    queryFn: async () => {
      const { data } = await getPhase(phaseId)
      return data
    },
  })

}
