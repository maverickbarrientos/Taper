

import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { CaretDownIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
}

export default function DatePicker<T extends FieldValues>({
  form,
  name,
  label
}: DatePickerProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => {
          const date: Date | undefined = field.value
            ? new Date(field.value)
            : undefined

          return (
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CaretDownIcon data-icon="inline-end" />
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => field.onChange(d)}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />
    </div>
  )
}