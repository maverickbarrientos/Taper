'use client'

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSimpleIcon, SpinnerIcon } from "@phosphor-icons/react"
import { Sheet, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import InputField from "@/components/input-field"
import PasswordField from "@/components/password-field"
import TagField from "@/components/tag-field"
import { User, UserUpdateData, userUpdateSchema } from "@/types/users"
import { useUpdateUser } from "@/hooks/use-update-user"
import { getErrorMessage } from "@/lib/utils"

type UserUpdateFormProps = {
  user: Pick<User, "firstName" | "lastName" | "email"> & Partial<Pick<User, "events" | "goals">>
  athleteId?: string
  // events and goals only exist for athletes
  includeAthleteFields?: boolean
  triggerLabel?: string
  title?: string
  description?: string
}

export default function UserUpdateForm({
  user,
  athleteId,
  includeAthleteFields = false,
  triggerLabel = "Edit profile",
  title = "Edit profile",
  description,
}: UserUpdateFormProps) {

  const [open, setOpen] = useState(false)
  const { mutateAsync, error, reset: resetMutation } = useUpdateUser(athleteId)

  const initialValues: UserUpdateData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: "",
    events: user.events ?? [],
    goals: user.goals ?? [],
  }

  const form = useForm<UserUpdateData>({
    mode: "onChange",
    resolver: zodResolver(userUpdateSchema),
    defaultValues: initialValues,
  })

  const { register, control, reset, handleSubmit, formState: { isDirty, isValid, isSubmitting, errors } } = form

  const onSubmit = async ({ password, events, goals, ...values }: UserUpdateData) => {
    try {
      const payload = {
        ...values,
        ...(includeAthleteFields && { events, goals }),
        // An empty password means "leave it unchanged".
        ...(password && { password }),
      }
      await mutateAsync(payload)
      reset({ ...values, events, goals, password: "" })
      setOpen(false)
    } catch {
      // surfaced through `error`
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      resetMutation()
      reset(initialValues)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={
        <Button variant="outline" className="flex items-center gap-2">
          <PencilSimpleIcon />
          {triggerLabel}
        </Button>
      } />
      <SheetContent className="pt-3">
        <SheetHeader className="space-y-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
          <Separator />
        </SheetHeader>

        <form id="user-update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 py-4">
          <div className="flex items-start gap-2">
            <InputField label="First Name" error={errors.firstName?.message} {...register("firstName")} />
            <InputField label="Last Name" error={errors.lastName?.message} {...register("lastName")} />
          </div>

          <InputField label="Email" type="email" error={errors.email?.message} {...register("email")} />

          {includeAthleteFields && (
            <>
              <Controller
                control={control}
                name="events"
                render={({ field }) => (
                  <TagField label="Events" placeholder="e.g. Regional Championships" value={field.value ?? []} onChange={field.onChange} />
                )}
              />
              <Controller
                control={control}
                name="goals"
                render={({ field }) => (
                  <TagField label="Goals" placeholder="e.g. Run a sub-11s 100m" value={field.value ?? []} onChange={field.onChange} />
                )}
              />
            </>
          )}

          <PasswordField
            label="New password"
            placeholder="Leave blank to keep the current password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {error && (
            <p role="alert" className="m-0 text-sm text-destructive">
              {getErrorMessage(error, "Couldn't save changes. Please try again.")}
            </p>
          )}
        </form>

        <SheetFooter>
          <Button form="user-update-form" type="submit" disabled={!isDirty || !isValid || isSubmitting}>
            {isSubmitting && <SpinnerIcon className="animate-spin" />}
            Save changes
          </Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )

}
