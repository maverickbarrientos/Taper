
import { useMutation } from "@tanstack/react-query";
import { createAthleteProficiency } from "@/features/onboarding/api";

export function useCreateAthleteProficiency() {

  return useMutation({
    mutationFn: createAthleteProficiency
  })

}