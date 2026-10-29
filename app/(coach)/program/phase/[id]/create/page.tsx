
import { BackButton } from "@/components/action-buttons"
import PageHeader from "@/components/page-header"
import SessionForm from "@/components/session-form"
import { getPhaseDetails } from "@/api/phase"

type CreateSessionProps = {
  params: Promise<{ id: string }>
}

export default async function CreateSession({ params }: CreateSessionProps) {

  const { id } = await params
  const { data: phase } = await getPhaseDetails(id)

  return (
    <div>
      <BackButton label="Program" />

      <PageHeader heading="New session" subHeading={phase.name} />

      <SessionForm mode={{ mode: "create" }} phaseStart={phase.startDate} phaseEnd={phase.endDate} />

    </div>
  )

}
