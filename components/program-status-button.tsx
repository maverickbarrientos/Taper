'use client'

import { CheckCircleIcon, ArrowCounterClockwiseIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ProgramStatus } from "@/types/program"
import { useUpdateProgram } from "@/hooks/use-update-program"

type ProgramStatusButtonProps = {
  programId: string
  status: ProgramStatus
}

export default function ProgramStatusButton({ programId, status }: ProgramStatusButtonProps) {

  const isOngoing = status === "ONGOING"

  const { mutate, isPending, error } = useUpdateProgram(programId)

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ?? "Couldn't update the program. Please try again."
    : null

  return (
    <div className="flex items-center gap-2">
      {errorMessage && <p role="alert" className="m-0 text-sm text-destructive">{errorMessage}</p>}
      <Button
        type="button"
        variant={isOngoing ? "default" : "outline"}
        disabled={isPending}
        onClick={() => mutate({ status: isOngoing ? "COMPLETED" : "ONGOING" })}
        className="flex items-center gap-2"
      >
        {isPending ? (
          <SpinnerIcon className="animate-spin" />
        ) : isOngoing ? (
          <CheckCircleIcon />
        ) : (
          <ArrowCounterClockwiseIcon />
        )}
        {isOngoing ? "Complete program" : "Reopen program"}
      </Button>
    </div>
  )

}
