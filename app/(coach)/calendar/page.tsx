import PageHeader from "@/components/page-header"
import SessionCalendar from "@/components/session-calendar"

export default function Calendar() {

  return (
    <div>
      <PageHeader heading="Calendar" subHeading="Scheduled sessions across all programs" />
      <SessionCalendar />
    </div>
  )

}
