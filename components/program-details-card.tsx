
import { format, differenceInCalendarDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ProgramWithPhaseAndSession } from "@/types/program"
import { getInitials, formatName } from "@/lib/utils"

type ProgramDetailProps = {
  label: string
  children: React.ReactNode
}

function ProgramDetail({ label, children }: ProgramDetailProps) {

  return (
    <div className="space-y-1">
      <p className="m-0 text-xs font-medium tracking-wide text-muted-foreground">{label}</p>
      <div className="flex items-center">{children}</div>
    </div>
  )
}

type ProgramDetailsCardProps = {
  program: ProgramWithPhaseAndSession
}

export default function ProgramDetailsCard({ program }: ProgramDetailsCardProps) {

  const currentPhase = program.phase.find((item) => item.status === "ONGOING");
  const daysToGo = differenceInCalendarDays(new Date(program.date), new Date());

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(program.athlete)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="m-0 text-xs font-medium tracking-wide text-muted-foreground">ATHLETE</p>
            <p className="m-0 text-base font-semibold">{formatName(program.athlete)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <ProgramDetail label="COMPETITION">
            <b>{format(program.date, "MMM d, yyyy")}</b>
          </ProgramDetail>

          <ProgramDetail label="COUNTDOWN">
            {daysToGo >= 0 ? <b>{daysToGo} days</b> : <span className="text-muted-foreground">Finished</span>}
          </ProgramDetail>

          <ProgramDetail label="DURATION">
            <b>{`${format(program.startDate, "MMM d")} - ${format(program.endDate, "MMM d")}`}</b>
          </ProgramDetail>

          <ProgramDetail label="CURRENT PHASE">
            {currentPhase ? (
              <Badge variant={'default'}>{currentPhase.phaseType}</Badge>
            ) : <span className="text-muted-foreground">-</span>}
          </ProgramDetail>
        </div>
      </CardContent>
    </Card>
  )

}
