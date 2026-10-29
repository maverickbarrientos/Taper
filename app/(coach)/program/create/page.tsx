
import PageHeader from "@/components/page-header"
import ProgramForm from "@/components/program-form"
import { BackButton } from "@/components/action-buttons"
import { getAllAthletes } from "@/api/users"

type CreateProgramProps = {
  searchParams: Promise<{ athleteId: string }>
}

export default async function CreateProgram({ searchParams }: CreateProgramProps) {

  const { athleteId } = await searchParams;

  const { data: athletes } = await getAllAthletes();

  return (
    <div>
      <BackButton label="Back to Program" />

      <PageHeader 
        heading="New program" 
        subHeading="Setup the athlete, the goal competition, and the training dates" 
      />

      <ProgramForm 
        selectedAthleteId={athleteId}
        mode={{ mode: "create" }} 
        athletes={athletes ?? []}  
      />
    </div>
  )

}