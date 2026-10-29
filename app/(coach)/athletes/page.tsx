
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Searchbar from "@/components/search-bar"
import AthleteForm from "@/components/athlete-form";
import TableActions from "@/components/table-actions";
import { DeleteAthleteButton } from "@/components/delete-button";
import PageHeader from "@/components/page-header";
import { getAllAthletes } from "@/api/users"
import { formatName } from "@/lib/utils";

export default async function Athletes() {

  const { data: athletes } = await getAllAthletes();

  return (
    <div>

      <PageHeader heading="Athletes">
        <AthleteForm triggerLabel="Add athlete" formLabel="Add athlete" formMode={{ mode: "create" }} />
      </PageHeader>
      <Searchbar className="w-full sm:w-1/2 lg:w-1/4 my-2" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {athletes.map((athlete) => (
            <TableRow key={athlete.id}>
              <TableCell>{formatName(athlete)}</TableCell>
              <TableCell>{athlete.email}</TableCell>
              <TableCell>
                <TableActions
                  href={`/athletes/${athlete.id}`}
                  deleteAction={<DeleteAthleteButton id={athlete.id} name={formatName(athlete)} />}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

}