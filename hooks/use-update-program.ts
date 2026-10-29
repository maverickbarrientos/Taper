'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateProgram } from "@/types/program"
import { updateProgram } from "@/api/program"

export function useUpdateProgram(programId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProgram) => updateProgram(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
