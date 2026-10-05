

import { useMutation } from "@tanstack/react-query";
import { createAthleteProfile } from "@/features/onboarding/api";

export function useCreateAthleteProfile() {

  return useMutation({
    mutationFn: createAthleteProfile
  })

}