import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  BarbellIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  FlagCheckeredIcon,
  SparkleIcon,
  TimerIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HeroGlow, HoverLift, MotionProvider, Reveal, Stagger, StaggerItem } from "@/components/landing-motion"

const EMAILS = {
  taper: "taper.peak@gmail.com",
  developer: "maverickbarrientos.dev@gmail.com",
  coach: "arjayquintos4@gmail.com",
}

const FEATURES = [
  {
    icon: FlagCheckeredIcon,
    title: "Built around competition day",
    description: "Start from the date that matters and plan backwards. Every program counts down to the meet.",
  },
  {
    icon: TimerIcon,
    title: "General, specific and taper phases",
    description: "Split a season into phases, then plan each one a session at a time with the exercises, sets and reps.",
  },
  {
    icon: BarbellIcon,
    title: "Athletes log every session",
    description: "Athletes see today's workout, log what they actually did, and keep their own history in one place.",
  },
  {
    icon: ChartLineUpIcon,
    title: "Compliance you can see",
    description: "Weekly compliance, streaks and volume show which athletes are on track and which need a call.",
  },
  {
    icon: SparkleIcon,
    title: "AI weekly summaries",
    description: "A short written recap of each athlete's week, generated from what they planned and what they logged.",
  },
  {
    icon: UsersThreeIcon,
    title: "One roster, two views",
    description: "Coaches manage athletes, programs and goals. Athletes get a focused view of their own training.",
  },
]

const STEPS = [
  { title: "Add your athletes", description: "Create an athlete account with their events and goals." },
  { title: "Plan the program", description: "Pick the competition date, set the phases and schedule the sessions." },
  { title: "Train and log", description: "Athletes log each session. You watch compliance and read the weekly summary." },
]

type PersonProps = {
  name: string
  initials: string
  role: string
  description: string
  email: string
}

function Person({ name, initials, role, description, email }: PersonProps) {

  return (
    <HoverLift className="h-full">
    <Card className="h-full">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="m-0 text-xl font-semibold">{name}</p>
            <Badge variant="outline">{role}</Badge>
          </div>
        </div>
        <p className="m-0 text-muted-foreground">{description}</p>
        <a
          href={`mailto:${email}`}
          className="flex w-fit items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
        >
          <EnvelopeSimpleIcon />
          {email}
        </a>
      </CardContent>
    </Card>
    </HoverLift>
  )

}

export default function Home() {

  return (
    <MotionProvider>
    <div className="flex min-h-svh flex-col">

      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/taper-logo.png" alt="Taper logo" width={32} height={32} className="rounded-md" />
            <span className="text-lg font-semibold">Taper</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">About</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#team" className="hover:text-foreground">Team</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <Button nativeButton={false} render={<Link href="/login" />}>Sign in</Button>
        </div>
      </header>

      <main className="flex-1">

        <section className="relative overflow-hidden border-b">
          <HeroGlow />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />
          <Stagger immediate className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-24 text-center md:py-32">
            <StaggerItem>
              <Badge variant="outline" className="h-7 px-3 text-sm">Coaching platform for track and field</Badge>
            </StaggerItem>
            <StaggerItem>
              <h1 className="m-0 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
                Peak on the <span className="text-primary">day that matters.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="m-0 max-w-2xl text-lg text-muted-foreground">
                Taper helps coaches plan every phase of a season, schedule every session and keep athletes on track,
                from the first week all the way to competition day.
              </p>
            </StaggerItem>
            <StaggerItem className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
                Sign in
                <ArrowRightIcon />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<a href="#contact" />}>
                Get in touch
              </Button>
            </StaggerItem>
          </Stagger>
        </section>

        <section id="about" className="scroll-mt-16 border-b">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
            <Reveal className="space-y-4">
              <p className="m-0 text-xs font-medium tracking-wide text-primary">WHAT IS TAPER</p>
              <h2 className="m-0 text-3xl font-semibold tracking-tight">Training plans that lead somewhere</h2>
              <p className="m-0 text-muted-foreground">
                A taper is the final stretch before a big competition, when training eases off so an athlete arrives fresh and ready.
                Getting it right depends on everything that came before it.
              </p>
              <p className="m-0 text-muted-foreground">
                Taper is a place for coaches and athletes to plan and follow that whole build-up. The coach designs the program
                around the competition date, and the athlete logs the work as it happens, so both can see how the season is going.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
            <Card>
              <CardContent className="space-y-4">
                {STEPS.map((step, index) => (
                  <div key={step.title}>
                    <div className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="m-0 font-semibold">{step.title}</p>
                        <p className="m-0 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            </Reveal>
          </div>
        </section>

        <section id="features" className="scroll-mt-16 border-b">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <Reveal className="mb-10 max-w-2xl space-y-3">
              <p className="m-0 text-xs font-medium tracking-wide text-primary">FEATURES</p>
              <h2 className="m-0 text-3xl font-semibold tracking-tight">Everything for the build-up</h2>
            </Reveal>
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <StaggerItem key={title}>
                  <HoverLift className="h-full">
                    <Card className="h-full">
                      <CardContent className="space-y-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                          <Icon size={22} />
                        </span>
                        <p className="m-0 font-semibold">{title}</p>
                        <p className="m-0 text-sm text-muted-foreground">{description}</p>
                      </CardContent>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="team" className="scroll-mt-16 border-b">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <Reveal className="mb-10 max-w-2xl space-y-3">
              <p className="m-0 text-xs font-medium tracking-wide text-primary">THE TEAM</p>
              <h2 className="m-0 text-3xl font-semibold tracking-tight">Built by a developer and a coach</h2>
              <p className="m-0 text-muted-foreground">
                Taper pairs the people who build the software with the person who uses it on the track.
              </p>
            </Reveal>
            <Stagger className="grid gap-5 md:grid-cols-2">
              <StaggerItem>
              <Person
                name="Maverick Barrientos"
                initials="MB"
                role="Developer"
                description="Designs and builds Taper, from the coach dashboard to the athlete's training log."
                email={EMAILS.developer}
              />
              </StaggerItem>
              <StaggerItem>
              <Person
                name="Arjay Quintos"
                initials="AQ"
                role="Coach"
                description="Brings the coaching side: how seasons are planned, how phases are structured and how athletes are guided to competition day."
                email={EMAILS.coach}
              />
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        <section id="contact" className="scroll-mt-16">
          <Reveal className="mx-auto w-full max-w-6xl px-6 py-20">
            <Card className="overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
              <CardContent className="flex flex-col items-start justify-between gap-6 py-4 md:flex-row md:items-center">
                <div className="space-y-2">
                  <p className="m-0 text-xs font-medium tracking-wide text-primary">CONTACT</p>
                  <h2 className="m-0 text-2xl font-semibold tracking-tight">Questions about Taper?</h2>
                  <p className="m-0 text-muted-foreground">Write to the Taper team, or reach out to us directly.</p>
                  <ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="text-primary" weight="fill" />
                      <span className="text-muted-foreground">Taper:</span>
                      <a href={`mailto:${EMAILS.taper}`} className="hover:underline">{EMAILS.taper}</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="text-primary" weight="fill" />
                      <span className="text-muted-foreground">Developer:</span>
                      <a href={`mailto:${EMAILS.developer}`} className="hover:underline">{EMAILS.developer}</a>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="text-primary" weight="fill" />
                      <span className="text-muted-foreground">Coach:</span>
                      <a href={`mailto:${EMAILS.coach}`} className="hover:underline">{EMAILS.coach}</a>
                    </li>
                  </ul>
                </div>
                <Button size="lg" nativeButton={false} render={<a href={`mailto:${EMAILS.taper}`} />}>
                  <EnvelopeSimpleIcon />
                  Email Taper
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </section>

      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/taper-logo.png" alt="" width={20} height={20} className="rounded" />
            <span>Taper</span>
          </div>
          <a href={`mailto:${EMAILS.taper}`} className="hover:text-foreground">{EMAILS.taper}</a>
        </div>
      </footer>

    </div>
    </MotionProvider>
  )

}
