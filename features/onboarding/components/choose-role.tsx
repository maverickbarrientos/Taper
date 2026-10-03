'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image, { StaticImageData } from "next/image"
import { SquareCheckBig } from "lucide-react"
import { Button } from "@/components/ui/button"
import coachSilhouette from "@/public/coach.png"
import athleteSilhouette from "@/public/athlete.png"
import { cn } from '@/lib/utils' 

const roleResponsibilities: Record<"COACH" | "ATHLETE", { title: string, subTitle: string, responsibilities: string[], signUpLabel: string, image: StaticImageData }> = {
  COACH: {
    title: "What you do as a coach",
    subTitle: "You build the program. Taper keeps your squad, sessions, and meet dates in one place.",
    responsibilities: [
      "Add athletes and see your whole squad in one place",
      "Build training programs for each athlete's event and competition date",
      "Set your program price and release the program once payment is received",
      "Review logged sessions (planned vs. actual)",
      "Get AI summaries of each athlete's progress",
    ],
    signUpLabel: "Create account as a coach",
    image: coachSilhouette
  },
  ATHLETE: {
    title: "What you do as an athlete",
    subTitle: "You follow a program built for you and log every session on the way to race day.",
    responsibilities: [
      "Complete your profile with your events and proficiency level",
      "Apply for a program from your coach",
      "Pay for your program in the app",
      "Follow your training plan and log your results",
      "Keep your information up to date and view your progress summary",
    ],
    signUpLabel: "Create account as an athlete",
    image: athleteSilhouette
  }
}

export default function ChooseRole () {

  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"COACH" | "ATHLETE">("COACH");
  const { title, subTitle, responsibilities, signUpLabel, image } = roleResponsibilities[role];

  function updateParams(patch: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/signup?${params.toString()}`);
  }

  return (

    <div className="my-4">
      <div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setRole("COACH")}
            variant={'outline'}
            className={cn('h-auto flex-col items-start gap-1 px-5 py-4', role === "COACH" && 'border border-primary')}
          >
            <h5 className="text-xl font-bold">{"I'm"} a coach</h5>
            <p className="text-sm text-muted-foreground">Build programs and track your squad</p>
          </Button>
          <Button 
            onClick={() => setRole("ATHLETE")}
            variant={'outline'}
            className={cn('h-auto flex-col items-start gap-1 px-5 py-4', role === "ATHLETE" && 'border border-primary')}
          >
            <h5 className="text-xl font-bold">{"I'm"} an athlete</h5>
            <p className="text-sm text-muted-foreground">Follow your program and log sessions</p>
          </Button>
        </div>

        <div className="space-y-2 my-4">
          <h3 className="text-4xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subTitle}</p>
          {responsibilities.map((item, index) => (
            <span key={index} className="flex gap-2">
              <SquareCheckBig className="text-primary" />
              <p>{item}</p>
            </span>
          ))}
          <Button 
            onClick={() => updateParams({ role })}
            className={'h-auto px-4 py-3 mt-4'}
          >
            {signUpLabel}
          </Button>
        </div>
      </div>

      <Image
        src={image}
        alt={role}
        className="pointer-events-none absolute bottom-0 right-0 hidden h-[85vh] w-auto object-contain lg:block"
        priority
      />

    </div>

  )

}