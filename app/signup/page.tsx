
import Link from "next/link"
import Image from "next/image"
import SignupForm from "@/features/auth/components/signup-form";
import logo from "@/public/taper-logo.png";
import coachSilhouette from "@/public/coach.png"
import athleteSilhouette from "@/public/athlete.png"

interface SignupProps {
  searchParams: Promise<{ role: "COACH" | "ATHLETE" }>
}

export default async function Signup ({searchParams}: SignupProps) {

  const params = await searchParams;
  const role = params.role

  return (

    <div className="p-6 min-h-dvh grid grid-cols-2">
      <div className="col-span-1 flex flex-col justify-between">
        <Link href={'/'} className='mr-3'>
          <div className='flex items-center'>
            <Image src={logo} alt='Taper logo' width={70} height={70} />
            <h3 className='font-bold font-sans text-3xl'>Taper</h3>
          </div>
        </Link>

        <Image
          src={role === "COACH" ? coachSilhouette : athleteSilhouette}
          alt={role}
          className="m-auto"
        />

        <p className="font-bold text-muted-foreground">
          Training built <br />
          toward <br />
          competition <br />
          day.
        </p>
      </div>

      <div className="col-span-1 flex flex-col my-auto p-5 w-4/5">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Your program and progress live here.</p>
        </div>

        <SignupForm role={role} />
      </div>
    </div>
  )

}