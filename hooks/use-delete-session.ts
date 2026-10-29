'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteSession } from "@/api/session"

export function useDeleteSession(sessionId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      queryClient.invalidateQueries({ queryKey: ["phase"] })
      router.refresh()
    },
  })

}
