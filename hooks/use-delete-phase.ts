'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePhase } from "@/api/phase"

export function useDeletePhase(phaseId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deletePhase(phaseId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["phase", phaseId] })
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
