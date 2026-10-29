'use client'

import { SparkleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/utils"

type SummaryRefreshButtonProps = {
  hasSummary: boolean
  isPending: boolean
  error: unknown
  onGenerate: () => void
}

export default function SummaryRefreshButton({ hasSummary, isPending, error, onGenerate }: SummaryRefreshButtonProps) {

  return (
    <div className="flex flex-col items-center gap-2">
      {error != null && <p role="alert" className="m-0 text-sm text-destructive">{getErrorMessage(error, "Couldn't generate the summary. Please try again.")}</p>}
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={onGenerate}>
        {isPending ? <SpinnerIcon className="animate-spin" /> : <SparkleIcon />}
        {isPending ? "Generating..." : hasSummary ? "Regenerate summary" : "Generate summary"}
      </Button>
      {hasSummary && !isPending && <p className="m-0 text-xs text-muted-foreground">Replaces the current summary.</p>}
    </div>
  )

}
