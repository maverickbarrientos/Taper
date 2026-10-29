'use client'

import { TrashSimpleIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ConfirmDialog from "@/components/confirm-dialog"
import { useDeleteProgram } from "@/hooks/use-delete-program"
import { useDeletePhase } from "@/hooks/use-delete-phase"
import { useDeleteSession } from "@/hooks/use-delete-session"
import { useDeleteAthlete } from "@/hooks/use-delete-athlete"

type DeleteButtonProps = {
  entity: string
  name: string
  label?: string
  warning?: string
  onDelete: () => Promise<unknown>
}

// Icon-only when no label is given.
function DeleteButton({ entity, name, label, warning, onDelete }: DeleteButtonProps) {

  return (
    <ConfirmDialog
      destructive
      title={`Delete ${entity}?`}
      description={<>This will permanently delete <b>{name}</b>. This action cannot be undone.{warning && <> {warning}</>}</>}
      confirmLabel="Delete"
      onConfirm={onDelete}
      trigger={
        <Button type="button" variant="destructive" aria-label={label ?? `Delete ${entity}`}>
          <TrashSimpleIcon />
          {label}
        </Button>
      }
    />
  )

}

type EntityDeleteProps = {
  id: string
  name: string
  label?: string
  redirectTo?: string
}

export function DeleteAthleteButton({ id, name, label, redirectTo }: EntityDeleteProps) {
  const router = useRouter()
  const { mutateAsync } = useDeleteAthlete(id)

  return (
    <DeleteButton
      entity="athlete"
      name={name}
      label={label}
      warning="They will also lose access to their account."
      onDelete={async () => {
        await mutateAsync()
        if (redirectTo) router.replace(redirectTo)
      }}
    />
  )
}

export function DeleteProgramButton({ id, name, label, redirectTo }: EntityDeleteProps) {
  const router = useRouter()
  const { mutateAsync } = useDeleteProgram(id)

  return (
    <DeleteButton
      entity="program"
      name={name}
      label={label}
      onDelete={async () => {
        await mutateAsync()
        if (redirectTo) router.replace(redirectTo)
      }}
    />
  )
}

export function DeletePhaseButton({ id, name, label, redirectTo }: EntityDeleteProps) {
  const router = useRouter()
  const { mutateAsync } = useDeletePhase(id)

  return (
    <DeleteButton
      entity="phase"
      name={name}
      label={label}
      onDelete={async () => {
        await mutateAsync()
        if (redirectTo) router.replace(redirectTo, { scroll: false })
      }}
    />
  )
}

export function DeleteSessionButton({ id, name, label }: EntityDeleteProps) {
  const { mutateAsync } = useDeleteSession(id)

  return <DeleteButton entity="session" name={name} label={label} onDelete={() => mutateAsync()} />
}
