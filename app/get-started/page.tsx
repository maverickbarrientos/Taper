
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/taper-logo.png"
import ChooseRole from "@/features/onboarding/components/choose-role"

export default function GetStarted () {

  return (

    <div className="m-6">

      <Link href={'/'} className='mr-3'>
        <div className='flex items-center'>
          <Image src={logo} alt='Taper logo' width={70} height={70} />
          <h3 className='font-bold font-sans text-3xl'>Taper</h3>
        </div>
      </Link>

      <div className="space-y-3">
        <h1 className="text-6xl font-bold">Create your <br /> account</h1>
        <p className="text-muted-foreground">Training that builds to race day. Choose how {"you'll"} use Taper <br /> to see what it does for you.</p>
      </div>
      
      <ChooseRole />

    </div>

  )

}