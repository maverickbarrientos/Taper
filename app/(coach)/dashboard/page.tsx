import PageHeader from "@/components/page-header"
import CoachDashboard from "@/components/analytics/coach-dashboard"

export default function Dashboard() {

  return (
    <div>
      <PageHeader heading="Dashboard" subHeading="Team adherence at a glance" />
      <CoachDashboard />
    </div>
  )

}
