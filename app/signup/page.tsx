
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/taper-logo.png";
import SignupForm from "@/features/auth/components/signup-form";

interface SignupProps {
  searchParams: Promise<{ role: "COACH" | "ATHLETE" }>
}

export default async function Signup ({searchParams}: SignupProps) {

  const params = await searchParams;
  const role = params.role

  return (

    <div className="m-5 p-6">
      <Link href={'/'} className='mr-3'>
        <div className='flex items-center'>
          <Image src={logo} alt='Taper logo' width={70} height={70} />
          <h3 className='font-bold font-sans text-3xl'>Taper</h3>
        </div>
      </Link>

      <div className="space-y-2">
        <h1 className="text-6xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">Your program and progress live here.</p>
      </div>

      <SignupForm role={role} />
    </div>
  )

}