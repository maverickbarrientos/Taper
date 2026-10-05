// app/sso-callback/page.jsx
"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";

export default function Page() {

  const router = useRouter();
  const role = useSearchParams().get("role");
  const hasRun = useRef(false);

  const { loaded } = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const navigate = async ({ session, decorateUrl }) => {
    if (session?.currentTask) return; // pending session task, let Clerk handle it
    const url = decorateUrl(`/auth/sync?role=${role}`);
    
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  };

  useEffect(() => {
    if (!loaded || hasRun.current) return;
    hasRun.current = true;

    (async () => {
      if (signIn.status === "complete") return signIn.finalize({ navigate });

      // Google account has no Clerk user yet, so create the sign-up
      const needsSignUp = signIn.isTransferable;
      if (needsSignUp) await signUp.create({ transfer: true });

      if (signUp.status === "complete") return signUp.finalize({ navigate });

      // Transfer left missing requirements, otherwise the flow never started
      router.push(needsSignUp ? "/sign-in/continue" : "/signup");
    })();
  }, [loaded, signIn, signUp]);

  return <div id="clerk-captcha" />; // needed for sign-up bot protection
}