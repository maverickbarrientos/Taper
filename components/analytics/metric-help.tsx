'use client'

import { InfoIcon } from "@phosphor-icons/react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export function Hint({ text, children }: { text: string, children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="cursor-help" />}>{children}</TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

export function MetricHelp({ text, label = "What does this mean?" }: { text: string, label?: string }) {
  return (
    <Hint text={text}>
      <InfoIcon size={14} aria-label={label} className="text-muted-foreground" />
    </Hint>
  )
}
