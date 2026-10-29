'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon } from "@phosphor-icons/react"
import { differenceInCalendarDays } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import InputField from "@/components/input-field"
import DatePicker from "@/components/date-picker"
import { FormMode } from "@/types/common"
import { ProgramWithAthlete, ProgramData, programSchema } from "@/types/program"
import { User } from "@/types/users"
import { getInitials, formatName } from "@/lib/utils"
import { createProgram } from "@/api/program"
import { useUpdateProgram } from "@/hooks/use-update-program"

type AthleteCardProps = {
  athlete: User,
  isSelected: boolean
  disabled?: boolean
  onSelectAthlete: (athleteId: string) => void
}

function AthleteCard ({ athlete, isSelected, disabled, onSelectAthlete }: AthleteCardProps) {

  return (
    <Button
      type="button"
      disabled={disabled}
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => onSelectAthlete(athlete.id)}
      className="h-auto w-full justify-start gap-3 px-3 py-2"
    >
      <Avatar>
        <AvatarFallback>{getInitials(athlete)}</AvatarFallback>
      </Avatar>
      <span className="truncate">{formatName(athlete)}</span>
      {isSelected && <CheckIcon className="ml-auto" />}
    </Button>
  )

}

function Stat({ label, value }: { label: string, value?: string }) {

  return (
    <div className="rounded-lg border p-3">
      <p className="m-0 text-xs text-muted-foreground">{label}</p>
      <p className="m-0 text-2xl font-semibold">{value ?? "—"}</p>
    </div>
  )

}

type ProgramFormProps = {
  athletes: User[]
  mode: FormMode<ProgramWithAthlete>
  selectedAthleteId?: string
}

export default function ProgramForm({ athletes, mode: { mode, data }, selectedAthleteId }: ProgramFormProps) {

  const isEdit = mode === "update"
  const isAthleteLocked = !!selectedAthleteId && athletes.some((athlete) => athlete.id === selectedAthleteId)

  const form = useForm<ProgramData>({
    mode: "onChange",
    resolver: zodResolver(programSchema),
    defaultValues: !isEdit ? {
      athleteId: selectedAthleteId ? selectedAthleteId : "",
      name: "",
      date: undefined,
      startDate: undefined,
      endDate: undefined,
    } : {
      athleteId: data.athlete.id,
      name: data.name,
      date: new Date(data.date),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    }
  });

  const { register, formState: { isDirty, isValid, isSubmitting }, handleSubmit } = form

  const [query, setQuery] = useState("")
  const router = useRouter()
  const updateProgramMutation = useUpdateProgram(data?.id ?? "")
  const athleteId = form.watch("athleteId");
  const watchedName = form.watch("name");

  const onSelectAthlete = (athleteId: string) => {
    form.setValue("athleteId", athleteId, { shouldValidate: true, shouldDirty: true });
  }

  const onSubmit = async (values: ProgramData) => {
    if (isEdit) {
      const { name, date, startDate, endDate } = values
      await updateProgramMutation.mutateAsync({ name, date, startDate, endDate })
      router.push(`/program/${data.id}`)
      return
    }

    await createProgram(values);
  }

  const filteredAthletes = athletes.filter((athlete) =>
    formatName(athlete).toLowerCase().includes(query.trim().toLowerCase())
  )

  const selectedAthlete = athletes.find((athlete) => athlete.id === athleteId)
  const [date, startDate, endDate] = form.watch(["date", "startDate", "endDate"])

  const days = (from?: Date, to?: Date) =>
    from && to ? differenceInCalendarDays(new Date(to), new Date(from)) : undefined
  const trainingDays = days(startDate, endDate)
  const taperDays = days(endDate, date)

  return (
    <form id="program-form" onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4 lg:h-[calc(100svh-13rem)]">

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">

        <Card className="min-h-0">
          <CardHeader>
            <CardTitle>1. Choose athlete</CardTitle>
            <CardDescription>{athletes.length} athletes on your roster</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
            <Input
              placeholder="Search athletes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto max-h-96 lg:max-h-none">
              {filteredAthletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id} athlete={athlete}
                  isSelected={athlete.id === athleteId}
                  disabled={isAthleteLocked && athlete.id !== selectedAthleteId}
                  onSelectAthlete={onSelectAthlete}
                />
              ))}
              {filteredAthletes.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No athletes found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex min-h-0 flex-col gap-4">

          <Card>
            <CardHeader>
              <CardTitle>2. Program details</CardTitle>
              <CardDescription>Name the goal competition and set the training window</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField label="Competition title" {...register("name")} />
              <div className="grid gap-3 sm:grid-cols-3">
                <DatePicker label="Competition date" form={form} name="date" />
                <DatePicker label="Training start" form={form} name="startDate" />
                <DatePicker label="Training end" form={form} name="endDate" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>{selectedAthlete ? getInitials(selectedAthlete) : "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="m-0 font-medium">{selectedAthlete ? formatName(selectedAthlete) : "No athlete selected"}</p>
                  <p className="m-0 text-sm text-muted-foreground">{watchedName || "Untitled competition"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Training days" value={trainingDays !== undefined ? String(trainingDays) : undefined} />
                <Stat label="Training weeks" value={trainingDays !== undefined ? (trainingDays / 7).toFixed(1) : undefined} />
                <Stat label="Days to competition" value={taperDays !== undefined ? String(taperDays) : undefined} />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-sm text-muted-foreground">
          {isValid ? (isEdit ? "Ready to save." : "Ready to create.") : "Select an athlete and fill in every field."}
        </p>
        <div className="flex gap-1">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={!isValid || isSubmitting || (isEdit && !isDirty)}>
            <CheckIcon />{isEdit ? "Save changes" : "Create program"}
          </Button>
        </div>
      </div>

    </form>
  )

}
