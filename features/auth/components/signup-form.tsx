'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useAuth, useClerk } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/google-icon";
import { useCreateAccount } from "@/features/auth/hooks/useCreateAccount";

export default function SignupForm({ role }: { role: "COACH" | "ATHLETE" }) {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, errors: googleError } = useSignIn();
  const { mutate: createAccount, isPending, isError, error } = useCreateAccount();

  function handleSubmit (e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const firstName = String(formData.get("first-name")).trim()
    const lastName = String(formData.get("last-name")).trim()
    const email = String(formData.get("email")).trim()
    const password = String(formData.get("password"))

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const newErrors: Record<string, string> = {}

    if (!firstName) newErrors.firstName = "First name is required"
    if (!lastName) newErrors.lastName = "Last name is required"
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email"
    if (password.length < 8) newErrors.password = "Use at least 8 characters"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    createAccount({ firstName, lastName, email, password, role }, {
      onSuccess: () => router.push('/onboarding'),
    });
    
  }

  async function signInWithGoogle() {
    const response = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: `/sso-callback?role=${role}`,
      redirectUrl: `/auth/sync?role=${role}`,
    });
    if (response.error) console.error(JSON.stringify(response.error  ))
  }

  return (

    <div className="space-y-4 my-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label className="text-md">First name</Label>
            <Input
              id="first-name"
              name="first-name"
              className="h-auto py-2"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label className="text-md">Last name</Label>
            <Input
              id="last-name"
              name="last-name"
              className="h-auto py-2"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-md">Email</Label>
          <Input
            id="email"
            name="email"
            className="h-auto py-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-md">Password</Label>
          <div className='relative'>
            <Input
              id='password'
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              className='pr-10 py-2 h-auto'
            />
            <Button
              type='button'
              variant='link'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2'
              tabIndex={-1}
            >
              {showPassword ? (
                "Hide"
              ) : (
                "Show"
              )}
            </Button>
          </div>
        </div>
        
        {isError || googleError && <p className="text-destructive">{isError}</p>}

        <Button 
          type="submit" 
          disabled={isPending}
          className={'w-full h-auto py-2'}
        >
          {isPending ? "Creating..." : "Create account"}
        </Button>
      </form>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <p className="text-sm text-muted-foreground">or</p>
        <Separator className="flex-1" />
      </div>

      <Button 
        variant={'outline'} 
        type="button"
        disabled={isPending}
        onClick={signInWithGoogle}
        className={'w-full h-auto py-2'}
      >
        <GoogleIcon /> Continue with Google
      </Button>

      <div className="flex items-center gap-0">
        <p className="text-sm text-muted-foreground">Already have an account?</p>
        <Link href={'/login'}>
          <Button variant={'link'} className={'px-1 text-xs'}>
            Log in
          </Button>
        </Link>
      </div>
    </div>

  )

}