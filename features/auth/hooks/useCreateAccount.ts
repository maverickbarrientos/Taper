

import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/features/auth/auth.api";

export function useCreateAccount() {

  return useMutation({
    mutationFn: createAccount
  });

}
