
import Link from "next/link"
import { format } from "date-fns"
import { EyeIcon } from "@phosphor-icons/react/dist/ssr"
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DeleteSessionButton } from "@/components/delete-button"
import { SessionWithExercise } from "@/types/session"

type SessionDetailsProps = {
  session: SessionWithExercise
}

export default function SessionDetails({ session }: SessionDetailsProps) {

  return (
    <Sheet>
      <SheetTrigger render={<Button><EyeIcon /></Button>} />
      <SheetContent className={"pt-3"}>
        <SheetHeader className="space-y-4">
          <SheetTitle>{session.title}</SheetTitle>
          <SheetDescription>{format(session.date, "MMM d, yyyy")}</SheetDescription>
          <Separator />
        </SheetHeader>

        <div className="p-4">
          <b className="text-muted-foreground">EXERCISES</b>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>PLANNED</TableHead>
                <TableHead>ACTUAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {session.exercise.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell>{`${exercise.sets} x ${exercise.reps}`}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <SheetFooter>
          <Button
            nativeButton={false}
            render={<Link href={`/program/session/${session.id}/edit`} />}
          >
            Edit session
          </Button>
          <DeleteSessionButton id={session.id} name={session.title} label="Delete session" />
          <SheetClose render={<Button variant={'outline'}>Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}