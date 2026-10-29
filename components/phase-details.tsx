'use client'

import { format } from "date-fns"
import { TimerIcon } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AddButton } from "@/components/action-buttons"
import { DeletePhaseButton } from "@/components/delete-button"
import PhaseForm from "@/components/phase-form"
import PhaseStatusButton from "@/components/phase-status-button"
import PhaseDetailsToolbar from "@/components/phase-details-toolbar"
import SessionDetails from "@/components/session-details"
import { usePhase } from "@/hooks/use-phase"
import { formatRange } from "@/lib/utils"

type PhaseDetailsProps = {
  phaseId: string
  programStart: Date | string
  programEnd: Date | string
}

export default function PhaseDetails({ phaseId, programStart, programEnd }: PhaseDetailsProps) {

  const { data: phase, isPending, isError, refetch } = usePhase(phaseId);

  if (isPending) {
    return (
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <Separator />
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <b>Couldn&apos;t load this phase</b>
          <Button variant="outline" onClick={() => refetch()}>Try again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="m-0">{phase.name}</h2>
            <Badge>{phase.phaseType}</Badge>
          </div>
          <p className="m-0 text-sm text-muted-foreground">{formatRange(phase)}</p>
        </div>
        <div className="flex items-center gap-2">
          <PhaseStatusButton phaseId={phase.id} status={phase.status} />
          <PhaseForm
            programId={phase.programId}
            programStart={programStart}
            programEnd={programEnd}
            mode={{ mode: "update", data: phase }}
            formLabel="Save changes"
            triggerLabel="Edit phase"
          />
          <DeletePhaseButton id={phase.id} name={phase.name} label="Delete" redirectTo={`/program/${phase.programId}`} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4">
        <PhaseDetailsToolbar
          phaseId={phase.id}
          phaseStart={phase.startDate}
          phaseEnd={phase.endDate}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DATE</TableHead>
              <TableHead>TITLE</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phase.session.length > 0 ? (
              phase.session.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{format(session.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{session.title}</TableCell>
                  <TableCell>
                    <SessionDetails session={session} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="p-0">
                  <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
                    <TimerIcon size={32} />
                    <b>No sessions planned</b>
                    <p>
                      Plan this phase one session at a time, then add the exercises.
                    </p>
                    <AddButton label="Add session" />
                  </div>
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

}