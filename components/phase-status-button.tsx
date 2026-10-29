'use client'

import { CheckCircleIcon, ArrowCounterClockwiseIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { PhaseStatus } from "@/types/phase"
import { useUpdatePhase } from "@/hooks/use-update-phase"

type PhaseStatusButtonProps = {
  phaseId: string
  status: PhaseStatus
}

export default function PhaseStatusButton({ phaseId, status }: PhaseStatusButtonProps) {

  const isCompleted = status === "COMPLETED"

  const { mutate, isPending, error } = useUpdatePhase(phaseId)

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ?? "Couldn't update the phase. Please try again."
    : null

  return (
    <div className="flex items-center gap-2">
      {errorMessage && <p role="alert" className="m-0 text-sm text-destructive">{errorMessage}</p>}
      <Button
        type="button"
        variant={isCompleted ? "outline" : "default"}
        disabled={isPending}
        onClick={() => mutate({ status: isCompleted ? "ONGOING" : "COMPLETED" })}
        className="flex items-center gap-2"
      >
        {isPending ? (
          <SpinnerIcon className="animate-spin" />
        ) : isCompleted ? (
          <ArrowCounterClockwiseIcon />
        ) : (
          <CheckCircleIcon />
        )}
        {isCompleted ? "Reopen phase" : "Complete phase"}
      </Button>
    </div>
  )

}
