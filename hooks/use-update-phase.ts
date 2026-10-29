'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdatePhase } from "@/types/phase"
import { updatePhase } from "@/api/phase"

export function useUpdatePhase(phaseId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePhase) => updatePhase(phaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phase"] })
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
