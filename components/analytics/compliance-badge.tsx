'use client'

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Adherence } from "@/types/analytics"
import { complianceTone, formatCompliance, COMPLIANCE_HELP, MISSED_HELP } from "@/lib/analytics"
import { Hint } from "@/components/analytics/metric-help"

const toneClass = {
  none: "bg-secondary text-muted-foreground",
  low: "bg-destructive/15 text-destructive",
  mid: "bg-warning/15 text-warning",
  high: "bg-primary/15 text-primary",
}

export function ComplianceBadge({ adherence }: { adherence: Adherence }) {
  const { compliance, logged, missed } = adherence
  const text = compliance === null
    ? `Nothing was due yet. ${COMPLIANCE_HELP}`
    : `${logged} logged, ${missed} missed of ${logged + missed} due. ${MISSED_HELP}`

  return (
    <Hint text={text}>
      <Badge className={cn(toneClass[complianceTone(compliance)])}>{formatCompliance(compliance)}</Badge>
    </Hint>
  )
}
