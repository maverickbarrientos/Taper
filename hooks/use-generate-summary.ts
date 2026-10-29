'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { generateProgramSummary } from "@/api/program"

export function useGenerateSummary(programId: string, athleteId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateProgramSummary(programId, athleteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
