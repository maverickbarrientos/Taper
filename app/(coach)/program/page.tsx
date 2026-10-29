
import Link from "next/link"
import { format } from "date-fns"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddButton } from "@/components/action-buttons"
import PageHeader from "@/components/page-header"
import TableActions from "@/components/table-actions"
import { DeleteProgramButton } from "@/components/delete-button"
import Searchbar from "@/components/search-bar"
import { formatName } from "@/lib/utils"
import { getAllPrograms } from "@/api/program"
import { ProgramStatus } from "@/types/program"

const STATUS: Record<ProgramStatus, string> = {
  ONGOING: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  SKIPPED: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default async function Program() {

  const { data: programs } = await getAllPrograms();

  return (
    <div>

      <PageHeader heading="Program">
        <Link href={'/program/create'}>
          <AddButton label="New program" />
        </Link>
      </PageHeader>
      <Searchbar className="w-full sm:w-1/2 lg:w-1/4 my-2" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TITLE</TableHead>
            <TableHead>ATHLETE</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>START DATE</TableHead>
            <TableHead>END DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.name}>
              <TableCell>{program.name}</TableCell>
              <TableCell>{formatName(program.athlete)}</TableCell>
              <TableCell>{format(new Date(program.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{format(new Date(program.startDate), "MMM d, yyyy")}</TableCell>
              <TableCell>{format(new Date(program.endDate), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <Badge className={STATUS[program.status]}>
                  {program.status}
                </Badge>
              </TableCell>
              <TableCell>
                <TableActions
                  href={`/program/${program.id}`}
                  editHref={`/program/edit/${program.id}`}
                  deleteAction={<DeleteProgramButton id={program.id} name={program.name} />}
                />
              </TableCell>
            </TableRow>
          ))}          
        </TableBody>
      </Table>

    </div>
  )

}