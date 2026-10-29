
import Link from "next/link"
import { format } from "date-fns"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/action-buttons"
import { DeleteAthleteButton } from "@/components/delete-button"
import UserUpdateForm from "@/components/user-update-form"
import AthleteFocus from "@/components/athlete-focus"
import ProgramAiSummaryCard from "@/components/program-ai-summary-card"
import { getAthleteDetails } from "@/api/users"
import { getInitials, formatName } from "@/lib/utils"

type AthleteDetailsProps = {
  params: Promise<{ id: string }>
}

export default async function AthleteDetails({ params }: AthleteDetailsProps) {

  const { id } = await params
  const { data: athlete } = await getAthleteDetails(id);

  const ongoingProgram = athlete.program.find((program) => program.status === "ONGOING");

  return (
    <div>
      <BackButton label={"Athletes"} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 my-5">
          <Avatar className={'size-15'}>
            <AvatarFallback className={'text-xl'}>
              {getInitials(athlete)}
            </AvatarFallback>
          </Avatar>
          <h1 className="m-0">{formatName(athlete)}</h1>
        </div>

        <div className="flex items-start gap-2">
          <UserUpdateForm
            user={athlete}
            athleteId={athlete.id}
            includeAthleteFields
            triggerLabel="Edit athlete"
            title="Edit athlete"
            description="Update this athlete's name, email or password."
          />
          <DeleteAthleteButton id={athlete.id} name={formatName(athlete)} label="Delete" redirectTo="/athletes" />

        <div className="flex flex-col items-end gap-1">
          <Link href={`/program/create?athleteId=${athlete.id}`}>
            <Button disabled={ongoingProgram && true}>
              <PlusIcon />
              Add program
            </Button>
          </Link>
          {ongoingProgram && <p className="text-muted-foreground text-xs m-0">This athlete already has an ongoing program</p>}
        </div>
        </div>
      </div>

      <Separator />

      <div className="my-5">
        <AthleteFocus events={athlete.events} goals={athlete.goals} />
      </div>

      {ongoingProgram && (
        <div className="my-5">
          <ProgramAiSummaryCard aiSummary={ongoingProgram.aiSummary?.[0]} programId={ongoingProgram.id} athleteId={athlete.id} />
        </div>
      )}

      <div className={"my-5"}>
        <b>PROGRAMS</b>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE</TableHead>
              <TableHead>COMPETITION DATE</TableHead>
              <TableHead>START DATE</TableHead>
              <TableHead>END DATE</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athlete.program.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{format(program.date, "MMM d, yyyy")}</TableCell>
                <TableCell>{format(program.startDate, "MMM d, yyyy")}</TableCell>
                <TableCell>{format(program.endDate, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={program.status === "ONGOING" ? 'default' : 'outline'}>
                    {program.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>  
        </Table>
      </div>    

    </div>
  )

}