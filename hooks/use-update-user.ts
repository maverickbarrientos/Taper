'use client'

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateUser } from "@/types/users"
import { updateAthlete, updateMyProfile } from "@/api/users"

// Pass an athlete id to update that athlete (coach only); omit it to update the logged-in user.
export function useUpdateUser(athleteId?: string) {

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUser) => athleteId ? updateAthlete(athleteId, data) : updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      router.refresh()
    },
  })

}
