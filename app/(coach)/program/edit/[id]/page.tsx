
import PageHeader from "@/components/page-header"
import ProgramForm from "@/components/program-form"
import { BackButton } from "@/components/action-buttons"
import { getProgramDetails } from "@/api/program"
import { getAllAthletes } from "@/api/users"

type EditProgramProps = {
  params: Promise<{ id: string }>
}

export default async function EditProgram({ params }: EditProgramProps) {

  const { id } = await params;
  
  const { data: program } = await getProgramDetails(id)
  const { data: athletes } = await getAllAthletes();

  return (
    <div>
      <BackButton label="Back to Program" />

      <PageHeader
        heading="Edit program"
        subHeading="Update the goal competition and the training dates"
      />

      <ProgramForm
        selectedAthleteId={program.athlete.id}
        mode={{ mode: "update", data: program }}
        athletes={athletes ?? []}  
      />
    </div>
  )

}