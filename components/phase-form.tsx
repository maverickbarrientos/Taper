'use client'

import { useState } from "react"
import { PlusIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter, 
  SheetClose 
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import InputField from "@/components/input-field"
import DatePicker from "@/components/date-picker"
import { FormMode } from "@/types/common"
import { Phase } from "@/types/phase"
import { PhaseData, phaseSchema, PhaseType } from "@/types/phase"
import { useAddPhase } from "@/hooks/use-add-phase"
import { useUpdatePhase } from "@/hooks/use-update-phase"

const phaseTypes: { label: string, value: PhaseType }[] = [
  { label: "General", value: "GENERAL" },
  { label: "Specific", value: "SPECIFIC" },
  { label: "Taper", value: "TAPER" },
]

type PhaseFormProps = {
  programId: string
  mode: FormMode<Phase>
  formLabel: string
  triggerLabel: string
}

export default function PhaseForm({ programId, mode: { mode, data }, formLabel, triggerLabel }: PhaseFormProps) {

  const isEdit = mode === "update"

  const form = useForm<PhaseData>({
    mode: "onChange",
    resolver: zodResolver(phaseSchema),
    defaultValues: !isEdit ? {
      name: "",
      phaseType: undefined,
      startDate: undefined,
      endDate: undefined,
    } : {
      name: data.name,
      phaseType: data.phaseType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    }
  });

  const { register, control, formState: { isDirty, isValid, isSubmitting }, handleSubmit } = form;

  const [open, setOpen] = useState(false)
  const addPhase = useAddPhase()
  const updatePhase = useUpdatePhase(data?.id ?? "")

  const onSubmit = async (values: PhaseData) => {
    if (!programId) return

    if (isEdit) {
      await updatePhase.mutateAsync(values)
    } else {
      await addPhase.mutateAsync({ ...values, programId })
      form.reset()
    }
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button variant={isEdit ? 'outline' : 'default'} className="flex items-center gap-2">
          {isEdit ? <PencilSimpleIcon /> : <PlusIcon />}
          {triggerLabel}
        </Button>
      }/>
      <SheetContent className="pt-3">
        <SheetHeader className="space-y-4">
          <SheetTitle>{formLabel}</SheetTitle>
          <Separator />
        </SheetHeader>
        
        <form 
          id="phase-form" 
          onSubmit={handleSubmit(onSubmit)} 
          className="px-4 py-4 space-y-4"
        >
          <InputField label="Name" placeholder="e.g. General Prep" {...register("name")} />

          <div className="space-y-2">
            <Label>Phase</Label>
            <Controller 
              control={control}
              name="phaseType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a phase type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Phase</SelectLabel>
                      {phaseTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="w-full grid items-center gap-2 sm:grid-cols-2">
            <DatePicker label="Start date" form={form} name="startDate" />
            <DatePicker label="End date" form={form} name="endDate" />
          </div>
        </form>

        <SheetFooter>
          <Button 
            form="phase-form" 
            type="submit" 
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {formLabel}
          </Button>
          <SheetClose render={<Button variant={'outline'}>Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}