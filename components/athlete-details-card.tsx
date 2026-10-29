
import { format } from "date-fns"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AthleteWithPrograms } from "@/types/users"
import { cn } from "@/lib/utils"

type AthleteDetailProps = {
  label: string
  children: React.ReactNode
  isLast?: boolean
  isFirst?: boolean
}

function AthleteDetail({ label, children, isLast = false, isFirst }: AthleteDetailProps) {

  return (
    <div>
      <div className={cn('flex items-center justify-between pb-5', !isFirst && "pt-5")}>
        <p className="text-muted-foreground">{label}</p>
        {children}
      </div>

      {!isLast && <Separator />}
    </div>
  )
}

type AthleteDetailsCardProps = {
  athlete: AthleteWithPrograms
}

export default function AthleteDetailsCard({ athlete }: AthleteDetailsCardProps) {

  const currentProgram = athlete.program.find((program) => program.status === "ONGOING");

  return (
    <Card className="my-5 col-span-1">
      <CardHeader>
        <h3 className="text-mtued-foreground mb-4 font-bold">ATHLETE DETAILS</h3>
        <Separator />
      </CardHeader>
      <CardContent>
        <AthleteDetail label="EMAIL" isFirst>
          <p>{athlete.email}</p>
        </AthleteDetail>
        <AthleteDetail label="CURRENT PROGRAM">
          <p>{currentProgram ? currentProgram.name : "-"}</p>
        </AthleteDetail>
        <AthleteDetail label="JOINED" isLast>
          <p>{format(athlete.createdAt, "MMM d, yyyy")}</p>
        </AthleteDetail>
      </CardContent>
    </Card>
  )

}