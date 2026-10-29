'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircleIcon, SpinnerIcon, WarningCircleIcon } from "@phosphor-icons/react"
import InputField from "@/components/input-field"
import PasswordField from "@/components/password-field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { loginSchema, LoginData } from "@/types/auth"
import { signInWithEmail } from "@/api/auth"
import { homeForRole } from "@/lib/roles"

export default function Login() {

  const form = useForm<LoginData>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { register, formState: { isValid, isSubmitting, errors }, handleSubmit } = form

  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (values: LoginData) => {
    setSubmitError(null)
    try {
      const { user } = await signInWithEmail(values);
      const home = homeForRole(user.user_metadata?.role)

      if (!home) {
        throw new Error("Your account has no role assigned. Please contact your coach.")
      }

      router.replace(home)
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">

      <div className="relative hidden flex-col justify-between overflow-hidden border-r bg-background p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative flex items-center gap-2">
          <Image src="/taper-logo.png" alt="Taper logo" width={32} height={32} className="rounded-md" />
          <span className="text-lg font-semibold">Taper</span>
        </div>

        <div className="relative max-w-md space-y-6">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Peak on the <span className="text-primary">day that matters.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Plan every phase, schedule every session and keep your athletes on track from the first week to competition day.
          </p>
          <ul className="space-y-3">
            {["Build programs around the competition date", "Split training into general and specific phases", "Plan sessions one week at a time"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircleIcon size={20} weight="fill" className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-muted-foreground">Built for coaches and their athletes.</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">

          <div className="flex items-center gap-2 lg:hidden">
            <Image src="/taper-logo.png" alt="Taper logo" width={32} height={32} className="rounded-md" />
            <span className="text-lg font-semibold">Taper</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue your programs</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {submitError && (
              <Alert variant="destructive">
                <WarningCircleIcon />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <InputField
              label="Email"
              disabled={isSubmitting}
              error={errors.email?.message}
              {...register("email")}
            />

            <PasswordField
              label="Password"
              disabled={isSubmitting}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </Button>
          </form>

        </div>
      </div>

    </div>
  )

}
