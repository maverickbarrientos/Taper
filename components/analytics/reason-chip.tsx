'use client'

import { Badge } from "@/components/ui/badge"
import { Reason } from "@/types/analytics"
import { REASON_META } from "@/lib/analytics"
import { Hint } from "@/components/analytics/metric-help"

export function ReasonChip({ reason }: { reason: Reason }) {
  const { label, description } = REASON_META[reason]

  return (
    <Hint text={description}>
      <Badge variant="outline">{label}</Badge>
    </Hint>
  )
}
