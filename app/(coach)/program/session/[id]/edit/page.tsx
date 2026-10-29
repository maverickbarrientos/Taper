
import { BackButton } from "@/components/action-buttons"
import PageHeader from "@/components/page-header"
import SessionForm from "@/components/session-form"
import { getSession } from "@/api/session"
import { getPhaseDetails } from "@/api/phase"

type EditSessionProps = {
  params: Promise<{ id: string }>
}

export default async function EditSession({ params }: EditSessionProps) {

  const { id } = await params;

  const { data: session } = await getSession(id);
  const { data: phase } = await getPhaseDetails(session.phaseId);

  return (
    <div>
      <BackButton label="Back to Program" />

      <PageHeader heading="Edit session" subHeading={session.title} />

      <SessionForm mode={{ mode: "update", data: session }} phaseStart={phase.startDate} phaseEnd={phase.endDate} />

    </div>
  )

}
