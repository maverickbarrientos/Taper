'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { SignOutIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import ConfirmDialog from "@/components/confirm-dialog"
import { signOut } from "@/api/auth"

type LogoutButtonProps = {
  variant?: "sidebar" | "button"
}

export default function LogoutButton({ variant = "sidebar" }: LogoutButtonProps) {

  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    setIsPending(true)
    try {
      await signOut()
      queryClient.clear() // don't leave the previous user's data cached
      router.replace("/login")
      router.refresh()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <ConfirmDialog
      title="Log out?"
      description="You will need to sign in again to access your account."
      confirmLabel="Log out"
      onConfirm={handleLogout}
      trigger={variant === "sidebar" ? (
        <SidebarMenuButton disabled={isPending}>
          {isPending ? <SpinnerIcon className="animate-spin" /> : <SignOutIcon />}
          <p>Log out</p>
        </SidebarMenuButton>
      ) : (
        <Button type="button" variant="destructive" disabled={isPending} className="flex items-center gap-2">
          {isPending ? <SpinnerIcon className="animate-spin" /> : <SignOutIcon />}
          Log out
        </Button>
      )}
    />
  )

}
