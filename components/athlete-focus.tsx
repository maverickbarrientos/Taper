import { CalendarStarIcon, FlagIcon } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type FocusListProps = {
  icon: React.ReactNode
  label: string
  items: string[]
  emptyText: string
}

function FocusList({ icon, label, items, emptyText }: FocusListProps) {

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <p className="m-0 text-xs font-medium tracking-wide">{label}</p>
        </div>
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => <Badge key={`${item}-${index}`} variant="secondary">{item}</Badge>)}
          </div>
        ) : (
          <p className="m-0 text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  )

}

type AthleteFocusProps = {
  events?: string[]
  goals?: string[]
}

export default function AthleteFocus({ events = [], goals = [] }: AthleteFocusProps) {

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <FocusList icon={<CalendarStarIcon />} label="EVENTS" items={events} emptyText="No events added yet." />
      <FocusList icon={<FlagIcon />} label="GOALS" items={goals} emptyText="No goals added yet." />
    </div>
  )

}
