'use client'

import { useState } from "react"
import { useForm, useFormContext, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LightningIcon, SpinnerIcon } from "@phosphor-icons/react"
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LogExerciseData, logExerciseSchema, Exercise } from "@/types/exercise"
import { SessionWithExercise } from "@/types/session"
import { logExercise } from "@/api/exercise"

type SetItemProps = {
  index: number
  plannedReps: string
}

function SetItem({ index, plannedReps }: SetItemProps) {

  const { register, formState: { errors } } = useFormContext<LogExerciseData>();
  const error = (errors.log)?.[index]?.reps?.message as string | undefined

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Set {index + 1}</p>
          <p className="text-xs text-muted-foreground">Planned: {plannedReps}</p>
        </div>
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          className="w-24"
          aria-label={`Set ${index + 1} reps`}
          {...register(`log.${index}.reps`)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

type LogExerciseModalProps = {
  session: SessionWithExercise
}

export default function LogExerciseModal({ session }: LogExerciseModalProps) {

  const [selectedExercise, setSelectedExercise] = useState<Exercise>(session.exercise[0]);
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const buildLog = (exercise: Exercise) =>
    Array.from({ length: Number(exercise.sets) }, (_, i) => ({
      set: (i + 1).toString(),
      reps: undefined as unknown as string,
    }))

  const form = useForm<LogExerciseData>({
    mode: "onChange",
    resolver: zodResolver(logExerciseSchema),
    defaultValues: {
      exerciseId: selectedExercise.id,
      log: buildLog(selectedExercise),
      notes: "",
    }
  });

  const handleExerciseChange = (exerciseId: string | null) => {
    const next = session.exercise.find((e) => e.id === exerciseId)
    if (!next) return
    setSelectedExercise(next)
    form.reset({
      exerciseId: next.id,
      log: buildLog(next),
      notes: form.getValues("notes"),
    })
  }

  const exerciseItems = session.exercise.map((e) => ({ value: e.id, label: e.name }))

  const { formState: { isSubmitting }, handleSubmit } = form;

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) setSubmitError(null)
  }

  const onSubmit = async (values: LogExerciseData) => {
    setSubmitError(null)
    try {
      await logExercise(values)
      setOpen(false)
      form.reset({
        exerciseId: selectedExercise.id,
        log: buildLog(selectedExercise),
        notes: "",
      })
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setSubmitError(message ?? "Couldn't save your log. Please try again.")
    }
  }

  return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button><LightningIcon />Quick log</Button>} />
        <DialogContent>
          <FormProvider {...form}>
            <form
              id="log-exercise-form"
              onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
            >
              <fieldset
                disabled={isSubmitting}
                className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
              >

              <DialogHeader>
                <DialogTitle>Quick log</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Exercise</Label>
                <Select
                  value={selectedExercise.id}
                  onValueChange={handleExerciseChange}
                  items={exerciseItems}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Exercises</SelectLabel>
                      {exerciseItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{selectedExercise.name}</h2>
                <p className="text-sm font-medium">Target: {`${selectedExercise.sets} x ${selectedExercise.reps}`}</p>
                <p className="text-sm text-muted-foreground">{"Coach's"} note: {`${selectedExercise.notes ? selectedExercise.notes : "-"}`}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground">REPS PER SET</p>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {Array.from({ length: Number(selectedExercise.sets)}, (_, i) => (
                    <SetItem
                      key={i}
                      index={i}
                      plannedReps={selectedExercise.reps}
                    />
                  ))
                  }
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="log-exercise-notes">Notes</Label>
                <Textarea
                  id="log-exercise-notes"
                  placeholder="How did it feel? Anything to flag for your coach?"
                  rows={3}
                  {...form.register("notes")}
                />
              </div>
              {submitError && (
                <p role="alert" className="text-sm text-destructive">{submitError}</p>
              )}
              <DialogFooter>
                <Button form="log-exercise-form" type="submit" disabled={isSubmitting}>
                  {isSubmitting && <SpinnerIcon className="animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
              </fieldset>
            </form>
          </FormProvider>

        </DialogContent>

      </Dialog>
  ) 
}