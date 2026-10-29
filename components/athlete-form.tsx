'use client'

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react"
import { Sheet, SheetTrigger, SheetHeader, SheetTitle, SheetContent, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import InputField from "@/components/input-field";
import TagField from "@/components/tag-field";
import { FormMode } from "@/types/common"
import { User, UserData, userSchema } from "@/types/users"
import { createAthlete } from "@/api/users";

type AthleteFormTriggerProps = {
  triggerLabel: string
  formLabel: string
  formMode: FormMode<User>
}

export default function AthleteForm({ triggerLabel, formLabel, formMode: { mode, data } }: AthleteFormTriggerProps) {

  const isEdit = mode === "update"

  const form = useForm<UserData>({
    mode: "onChange",
    resolver: zodResolver(userSchema),
    defaultValues: !isEdit ? { 
      firstName: "",
      lastName: "",
      email: "",
      events: [],
      goals: []
    } : data
  });

  const { register, control, formState: { isDirty, isValid, isSubmitting }, handleSubmit } = form

  const onSubmit = async (values: UserData) => {
    await createAthlete(values)
  }

  return (
    <Sheet>
      <SheetTrigger render={
        <Button className="flex items-center gap-2">
          <PlusIcon />
          {triggerLabel}
        </Button>
      }/>
      <SheetContent className="pt-3">
        <SheetHeader className="space-y-4">
          <SheetTitle>{formLabel}</SheetTitle>
          <Separator />
        </SheetHeader>
        
        <form 
          id="athlete-form" 
          onSubmit={handleSubmit(onSubmit)} 
          className="px-4 py-4 space-y-4"
        >
          <div className="flex items-center gap-2">
            <InputField label="First Name" placeholder="e.g. John" {...register("firstName")} />
            <InputField label="Last Name" placeholder="e.g. Doe" {...register("lastName")} />
          </div>

          <InputField label="Email" placeholder="e.g. johndoe@email.com" type="email" {...register("email")} />

          <Controller
            control={control}
            name="events"
            render={({ field }) => (
              <TagField label="Events (optional)" placeholder="e.g. Regional Championships" value={field.value ?? []} onChange={field.onChange} />
            )}
          />
          <Controller
            control={control}
            name="goals"
            render={({ field }) => (
              <TagField label="Goals (optional)" placeholder="e.g. Run a sub-11s 100m" value={field.value ?? []} onChange={field.onChange} />
            )}
          />
        </form>

        <SheetFooter>
          <Button 
            form="athlete-form" 
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