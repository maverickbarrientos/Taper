'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateSession } from "@/types/session"
import { updateSession } from "@/api/session"

export function useUpdateSession(sessionId: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateSession) => updateSession(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      queryClient.invalidateQueries({ queryKey: ["phase"] })
      router.refresh()
    },
  })

}
