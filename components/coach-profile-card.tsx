import { format } from "date-fns"
import { CalendarBlankIcon, EnvelopeSimpleIcon, IdentificationCardIcon } from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "@/types/users"
import { formatName, getInitials } from "@/lib/utils"

type InfoTileProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function InfoTile({ icon, label, value }: InfoTileProps) {

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <p className="m-0 text-xs font-medium tracking-wide">{label}</p>
        </div>
        <p className="m-0 break-all text-base font-semibold">{value}</p>
      </CardContent>
    </Card>
  )

}

type CoachProfileCardProps = {
  coach: User
  action?: React.ReactNode
}

export default function CoachProfileCard({ coach, action }: CoachProfileCardProps) {

  return (
    <div className="space-y-5">

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
        <CardContent className="-mt-12 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar className="size-24 ring-4 ring-card">
              <AvatarFallback className="text-3xl font-bold">{getInitials(coach)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="m-0">{formatName(coach)}</h1>
                <Badge>{coach.role}</Badge>
              </div>
              <p className="m-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                <EnvelopeSimpleIcon />
                {coach.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-1">
            <p className="m-0 text-xs tracking-wide text-muted-foreground">
              MEMBER SINCE {format(new Date(coach.createdAt), "MMM yyyy").toUpperCase()}
            </p>
            {action}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-3">
        <InfoTile icon={<IdentificationCardIcon />} label="ROLE" value="Coach" />
        <InfoTile icon={<EnvelopeSimpleIcon />} label="EMAIL" value={coach.email} />
        <InfoTile icon={<CalendarBlankIcon />} label="JOINED" value={format(new Date(coach.createdAt), "MMM d, yyyy")} />
      </div>

    </div>
  )

}
