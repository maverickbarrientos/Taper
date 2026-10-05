
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/taper-logo.png"
import AthleteOnboardingForm from "@/features/onboarding/components/athlete-onboarding-form"

export default function AthleteOnboarding() {

  return (

    <div className="p-6 min-h-dvh">
      <Link href={'/'} className='mr-3'>
        <div className='flex items-center'>
          <Image src={logo} alt='Taper logo' width={70} height={70} />
          <h3 className='font-bold font-sans text-3xl'>Taper</h3>
        </div>
      </Link>

      <div className="flex items-center justify-center w-full">
        <AthleteOnboardingForm />
      </div>
    </div>

  ) 
}