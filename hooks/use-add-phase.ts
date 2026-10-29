'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreatePhase } from "@/types/phase"
import { addPhaseToProgram } from "@/api/phase"

export function useAddPhase() {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePhase) => addPhaseToProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
