'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProgram } from "@/api/program"

export function useDeleteProgram(programId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] })
      router.refresh()
    },
  })

}
