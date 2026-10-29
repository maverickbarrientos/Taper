'use client'

import { useParams, useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircleIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon } from "@phosphor-icons/react"
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import InputField from "@/components/input-field"
import DatePicker from "@/components/date-picker"
import { FormMode } from "@/types/common"
import { SessionWithExercise, SessionData, sessionSchema } from "@/types/session"
import { createSession } from "@/api/session"
import { useUpdateSession } from "@/hooks/use-update-session"

const emptyExercise = { name: "", sets: "", reps: "", notes: "", order: 1 }

type SessionFormProps = {
  mode: FormMode<SessionWithExercise>
  // The session date must fall inside the phase's dates
  phaseStart?: Date | string
  phaseEnd?: Date | string
}

export default function SessionForm({ mode: { mode, data }, phaseStart, phaseEnd }: SessionFormProps) {

  const { id } = useParams();
  const router = useRouter();
  const isEdit = mode === "update"

  const form = useForm<SessionData>({
    mode: "onChange",
    resolver: zodResolver(sessionSchema),
    defaultValues: !isEdit ? {
      title: "",
      date: undefined,
      notes: undefined,
      exercise: [emptyExercise]
    } : {
      title: data.title,
      date: new Date(data.date),
      notes: data.notes,
      exercise: [...data.exercise]
        .sort((a, b) => a.order - b.order)
        .map(({ id, name, sets, reps, notes, order }) => ({ id, name, sets, reps, notes, order })),
    }
  });
  const { register, control, formState: { isDirty, isValid, isSubmitting }, handleSubmit } = form

  const { fields, append, remove, move } = useFieldArray({ control, name: "exercise", keyName: "fieldKey" });

  const updateSessionMutation = useUpdateSession(data?.id ?? "")

  const onSubmit = async (values: SessionData) => {
    const exercise = values.exercise.map((exercise, index) => ({
      ...exercise,
      order: index + 1
    }));

    if (isEdit) {
      await updateSessionMutation.mutateAsync({ ...values, exercise })
      router.back()
      return
    }

    if (!id || typeof id !== "string") return

    await createSession({ ...values, exercise, phaseId: id });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 my-4">
        <div>
          <b>SESSION DETAILS</b>
          <Separator />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <InputField label="Title" placeholder="e.g. 100m sprint" {...register("title")} />
          <DatePicker
            form={form}
            name="date"
            label="Date"
            minDate={phaseStart ? new Date(phaseStart) : undefined}
            maxDate={phaseEnd ? new Date(phaseEnd) : undefined}
          />
        </div>

        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea className="resize-none" {...register("notes")} />
        </div>
      </div>

      <div>
        <b>EXERCISES</b>
        <Separator />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>EXERCISE</TableHead>
              <TableHead>SETS</TableHead>
              <TableHead>REPS</TableHead>
              <TableHead>NOTES</TableHead>
              <TableHead className="w-0"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((exercise, index) => (
              <TableRow key={exercise.fieldKey}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Input {...register(`exercise.${index}.name`)} />
                </TableCell>
                <TableCell>
                  <Input {...register(`exercise.${index}.sets`)} />
                </TableCell>
                <TableCell>
                  <Input {...register(`exercise.${index}.reps`)} />
                </TableCell>
                <TableCell>
                  <Input {...register(`exercise.${index}.notes`)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Move exercise ${index + 1} up`}
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Move exercise ${index + 1} down`}
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove exercise ${index + 1}`}
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={6}>
                <Button
                  type="button"
                  variant={'ghost'}
                  className="w-full"
                  onClick={() => append({ ...emptyExercise, order: fields.length + 1 })}
                >
                  <PlusCircleIcon />
                  <p>Add exercise</p>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end my-3">
        <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
          {isEdit ? "Save changes" : "Create session"}
        </Button>
      </div>
    </form>
  )

}