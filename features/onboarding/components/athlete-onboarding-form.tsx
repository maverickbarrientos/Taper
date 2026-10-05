'use client'

import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext, useController, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";   
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import StepCounter from "@/components/step-counter"
import EventsSelect from "@/components/events-select";
import { Level, GoalType, GOAL_TYPES } from "@/types/athlete";
import { capitalize } from "@/lib/utils";
import { useStepNavigation } from "@/features/onboarding/hooks/useStepNavigation";
import { ATHLETE_FITNESS_LEVEL } from "@/features/onboarding/constants";
import { AthleteOnboardingData, athleteOnboardingSchema, stepSchemas } from "@/features/onboarding/types";
import { useCreateAthleteProfile } from "@/features/onboarding/hooks/useCreateAthleteProfile";
import { useCreateAthleteProficiency } from "@/features/onboarding/hooks/useCreateAthleteProficiency";

function AthleteDetails () {

  const { register, formState: { errors }, control } = useFormContext<AthleteOnboardingData>();
  const { field, fieldState } = useController({
    control,
    name: "birthdate",
  })

  return (
    <div className="my-5">
      <div className="space-y-2">
        <h2 className="font-bold text-5xl">Your details</h2>
        <p className="text-muted-foreground">A few basics so your program fits you</p>
      </div>

      <div className="my-5 space-y-4">
        <div className="space-y-2">
          <Label>Birthday</Label>
          <Popover>
            <PopoverTrigger 
              render={
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="justify-between text-left font-normal data-[empty=true]:text-muted-foreground w-full"
                >
                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  <ChevronDownIcon />
                </Button>
              }
            />
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={field.value}
                defaultMonth={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  field.onBlur()
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <div className="space-y-2 flex-1">
            <Label>Height</Label>
            <div className="relative">
              <Input type="number" {...register("height", { valueAsNumber: true })} className="pr-10" />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground font-bold">
                cm
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Weight</Label>
            <div className="relative">
              <Input type="number" {...register("weight", { valueAsNumber: true })} className="pr-10" />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground font-bold">
                kg
              </span>
            </div>
          </div>
        </div>

        {fieldState.error && <p className="text-destructive">{fieldState.error.message}</p>}

      </div>
    </div>
  )
}

function AthleteEvents() {

  const { control } = useFormContext<AthleteOnboardingData>()

  const { field: eventsField, fieldState: eventsState } = useController({
    control,
    name: "events",
  })
  const { field: otherField, fieldState: otherState } = useController({
    control,
    name: "otherEvents",
  })

  return (

    <div className="my-5">
      <div className="space-y-2">
        <h2 className="font-bold text-5xl">Your events</h2>
        <p className="text-muted-foreground">Pick every event you train for. Add your own if it is not listed.</p>
      </div>

       <EventsSelect
        events={eventsField.value ?? []}
        onEventsChange={eventsField.onChange}
        otherEvents={otherField.value ?? []}
        onOtherEventsChange={otherField.onChange}
      />

      {eventsState.error && <p className="text-destructive">{eventsState.error.message}</p>}
      {otherState.error && <p className="text-destructive">{otherState.error.message}</p>}
    </div>
  )
}

function AthleteFitnessLevel() {

  const { control } = useFormContext<AthleteOnboardingData>();
  const { field, fieldState } = useController({
    control,
    name: "level",
  })

  return (
    <div className="my-5">
      <div className="space-y-2">
        <h2 className="font-bold text-5xl">Your fitness level</h2>
        <p className="text-muted-foreground">Choose the one that fits you today.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 my-5">
        {Object.keys(ATHLETE_FITNESS_LEVEL).map((key) => {
          const { title, description } = ATHLETE_FITNESS_LEVEL[key as Level]
          const selected = field.value === key

          return (
            <Button 
              key={key}
              onClick={() => field.onChange(key)}
              variant={selected ? 'default' : 'outline'}
              className={'h-auto flex flex-col items-start whitespace-normal py-4 px-3'}
            >
              <p className="font-bold text-lg">{title}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground text-left">{description}</p>
            </Button>
          )
        })}
      </div>

      {fieldState.error && <p className="text-destructive">{fieldState.error.message}</p>}
    
    </div>
  )
}

function AthleteGoals() {

  const { control } = useFormContext<AthleteOnboardingData>();

  const { field, fieldState } = useController({
    control,
    name: "goals",
  });

  const goals: GoalType[] = field.value ?? []

  function toggle(goal: GoalType) {
    field.onChange(
      goals.includes(goal)
      ? goals.filter((g) => g !== goal)
      : [...goals, goal]
    )
  }

  return (
    <div className="my-5">
      <div className="space-y-2">
        <h2 className="font-bold text-5xl">Your fitness level</h2>
        <p className="text-muted-foreground">Choose the one that fits you today.</p>
      </div>

      <div className="flex flex-wrap gap-2 my-5">
        {GOAL_TYPES.map((goal) => {
          const selected = goals.includes(goal)

          return (
            <Button 
              key={goal}
              variant={selected ? 'default' : 'outline'}
              size={'lg'}
              onClick={() => toggle(goal)}
            >
              {capitalize(goal)}
            </Button>
          )
        })}
      </div>

      {fieldState.error && <p className="text-destructive">{fieldState.error.message}</p>}

    </div>    
  )
}

export default function AthleteOnboardingForm () {

  const router = useRouter();
  const { mutate: createProfile, isPending: createProfilePending } = useCreateAthleteProfile();
  const { mutate: createProficiency, isPending: createProficiencyPending } = useCreateAthleteProficiency();
  const form = useForm<AthleteOnboardingData>({
    mode: "onTouched",
    resolver: zodResolver(athleteOnboardingSchema),
    defaultValues: {
      birthdate: new Date(),
      weight: undefined,
      height: undefined,
      events: [],
      otherEvents: [],
      level: undefined,
      goals: []
    }
  });

  const { formState: { isDirty, isValid, isSubmitting }, handleSubmit, control } = form;
  const { currentStep, stepNumber, totalSteps, isFirstStep, isLastStep, handleNext, handleBack } = useStepNavigation(form.trigger);
  const isPending =
    createProfilePending || createProficiencyPending || isSubmitting;
  const values = useWatch({ control: form.control });
  const stepValid = stepSchemas[currentStep].safeParse(values).success;

  async function onSubmit(values: AthleteOnboardingData) {
    const DEV_ATHLETE_ID = "85c11a7d-4a2b-49ec-8ca1-749bc5595bce"
    console.log("CURRENT STEP", currentStep, "STEP NUMBER", stepNumber, isLastStep)
    console.log(values)
    
    try {
      await createProfile({
        athleteId: DEV_ATHLETE_ID,
        birthDate: values.birthdate,
        heightCm: Number(values.height),
        weightKg: Number(values.weight),
      });

      await createProficiency({
        athleteId: DEV_ATHLETE_ID,
        event: values.events,
        otherEvent: values.otherEvents ?? [],
        level: values.level,
        goal: values.goals,
      });

      router.push("/home");
    } catch (error) {
      // show a toast or form-level error; stay on the page
      console.error(error);
    }
  }

  return (
    <FormProvider {...form}>
      <form action=""  className="w-1/3" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="min-h-100 p-5">
            <StepCounter numberOfSteps={totalSteps} currentStep={stepNumber} />
            {currentStep === 0 && <AthleteDetails />}
            {currentStep === 1 && <AthleteEvents />}
            {currentStep === 2 && <AthleteFitnessLevel />}
            {currentStep === 3 && <AthleteGoals />}
          </CardContent>
          <CardFooter>
            <div className="mt-4 w-full grid grid-cols-3 gap-2">
              <Button 
                variant={'outline'}
                className={'col-span-1'}
                onClick={handleBack}
                disabled={isFirstStep}
              >
                Back
              </Button>

              <Button
                className={'col-span-2'}
                type="button"
                onClick={isLastStep ? form.handleSubmit(onSubmit) : handleNext}
                disabled={isPending || !stepValid}
              >
                {isPending ? "Setting up..." : isLastStep ? "Finish" : "Continue"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}