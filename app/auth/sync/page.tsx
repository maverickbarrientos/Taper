'use client'

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"
import { syncUserInformation } from "@/features/auth/auth.api";

export default function Sync() {

  const params = useSearchParams();
  const role = params.get("role") as "COACH" | "ATHLETE";
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    (async () => {
      if (!user || !isLoaded) return 

      const response = await syncUserInformation({
        clerkId: user.id,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user.emailAddresses.toString(),
        role
      });

      if (response.status === 201 && role === "ATHLETE") {
        router.push('/onboarding/athlete');
      } else if (response.status === 201 && role === "COACH") {
        router.push('/onboarding/coach');
      };
    })();

  }, [isLoaded]);

  return <p className="flex items-center justify-center my-auto">Setting up your account...</p>

}