
import { isSameDay, format, differenceInCalendarDays } from "date-fns";
import { DotIcon, LightningIcon, BarbellIcon, CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import LogExerciseModal from "@/components/log-exercise-modal";
import { createClient } from "@/lib/supabase/server";
import { Exercise } from "@/types/exercise";
import { getAthleteProgram } from "@/api/program"
import { getGreeting, getCurrentDate } from "@/lib/utils";


function ExerciseItem({ exercise, isLast }: { exercise: Exercise, isLast?: boolean }) {

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <b className="font-medium">{exercise.name}</b>
          <p className="text-muted-foreground m-0 whitespace-nowrap">{`${exercise.sets} x ${exercise.reps}`}</p>
        </div>
        <p className="text-muted-foreground m-0">{exercise.notes ? exercise.notes : "-"}</p>
      </div>

      {!isLast && <Separator />}
    </>
  )

}

async function loadProgram() {
  try {
    const { data } = await getAthleteProgram();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {

  const program = await loadProgram();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date()
  const currentPhase = program?.phase?.find((phase) => phase.status === "ONGOING")
  const todayWorkout = currentPhase?.session.find((session) => isSameDay(new Date(session.date), today))

  const daysRemaining = program
    ? Math.max(differenceInCalendarDays(new Date(program.endDate), today), 0)
    : 0

  return (
    <div>
      <div>
        <h1>{getGreeting(user?.user_metadata.first_name)}</h1>
        <p className="text-muted-foreground m-0">{getCurrentDate()}</p>
      </div>

      <Separator className={'my-5 px-3'} />

      <div className="grid gap-5 lg:grid-cols-3">

        {todayWorkout ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">{"TODAY'S WORKOUT"}</p>
              <CardTitle>
                {todayWorkout.title}
              </CardTitle>
              <CardDescription className="flex items-center">
                {`${todayWorkout.exercise.length} ${todayWorkout.exercise.length === 1 ? "exercise" : "exercises"}`}
                <DotIcon />
                <Badge>{currentPhase?.phaseType}</Badge>
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-(--card-spacing)">
              {todayWorkout.exercise.length > 0 ? (
                todayWorkout.exercise.map((exercise, index) => (
                  <ExerciseItem
                    key={exercise.id}
                    exercise={exercise}
                    isLast={index === todayWorkout.exercise.length - 1}
                  />
                ))
              ) : (
                <p className="text-muted-foreground m-0">No exercises added to this workout yet.</p>
              )}
            </CardContent>

            <CardFooter className="flex justify-end">
              <LogExerciseModal session={todayWorkout} />
            </CardFooter>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">{"TODAY'S WORKOUT"}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <BarbellIcon size={32} className="text-muted-foreground" />
              <CardTitle>No workout for today</CardTitle>
              <CardDescription>
                {program
                  ? "Rest up. Your next session will show here when it's scheduled."
                  : "Your coach hasn't assigned a program yet."}
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {program ? (
          <Card>
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">CURRENT PROGRAM</p>
              <CardTitle>{program.name}</CardTitle>
              <CardDescription>{format(new Date(program.date), "MMM d, yyyy")}</CardDescription>
            </CardHeader>
            <Separator className="px-3"/>
            <CardContent className="flex flex-col gap-3">
              <div>
                <p className="m-0 text-2xl font-semibold">{daysRemaining}</p>
                <p className="text-muted-foreground m-0">{daysRemaining === 1 ? "day remaining" : "days remaining"}</p>
              </div>
              <div>
                <Badge variant={currentPhase ? "default" : "secondary"}>
                  {currentPhase?.phaseType ?? "No active phase"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <p className="text-muted-foreground m-0 text-xs tracking-wide">CURRENT PROGRAM</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <CalendarBlankIcon size={32} className="text-muted-foreground" />
              <CardTitle>No program yet</CardTitle>
              <CardDescription>Once your coach creates one, it will appear here.</CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

}
