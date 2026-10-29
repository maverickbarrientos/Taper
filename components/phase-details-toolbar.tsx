'use client'

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addDays } from "date-fns"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AddButton } from "@/components/action-buttons"
import { formatRange } from "@/lib/utils"
import { getWeekInfo } from "@/lib/weeks"

type Props = {
  phaseId: string
  phaseStart: Date
  phaseEnd: Date  
}

export default function PhaseDetailsToolbar({ phaseId, phaseStart, phaseEnd }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const view = searchParams.get("view") === "phase" ? "phase" : "week"
  const { week, totalWeeks, todayWeek } = getWeekInfo(phaseStart, phaseEnd, searchParams.get("week"))

  let label: string
  if (view === "phase") {
    label = formatRange({ startDate: phaseStart, endDate: phaseEnd })
  } else {
    const weekStart = addDays(phaseStart, (week - 1) * 7)
    const weekEnd = addDays(weekStart, 6)
    label = formatRange({
      startDate: weekStart,
      endDate: weekEnd > phaseEnd ? phaseEnd : weekEnd,
    })
  }

  function setParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) params.delete(key)
      else params.set(key, value)
    }
    params.delete("sessionId") // selection belongs to the old range
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const weekNavDisabled = view === "phase" || isPending

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Tabs
        value={view}
        onValueChange={(v) => setParams({ view: v === "phase" ? "phase" : null })}
      >
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="phase">Whole phase</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          aria-label="Previous week"
          disabled={weekNavDisabled || week <= 1}
          onClick={() => setParams({ week: String(week - 1) })}
        >
          <CaretLeftIcon />
        </Button>
        <b className="min-w-44 text-center text-sm">{label}</b>
        <Button
          variant="ghost"
          aria-label="Next week"
          disabled={weekNavDisabled || week >= totalWeeks}
          onClick={() => setParams({ week: String(week + 1) })}
        >
          <CaretRightIcon />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={view === "phase" || isPending}
          onClick={() => setParams({ week: String(todayWeek) })}
        >
          Today
        </Button>
        <AddButton
          label="Add session"
          onClick={() => router.push(`/program/phase/${phaseId}/create`)}
        />
      </div>
    </div>
  )
}