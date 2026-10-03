
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import logo from '@/public/taper-logo.png'

function Topbar() {

  return (
    <nav className='flex items-center justify-between px-50 py-2 border-b border-border sticky'>
      <div className='flex items-center gap-4'>
        <Link href={'/'} className='mr-3'>
          <div className='flex items-center'>
            <Image src={logo} alt='Taper logo' width={70} height={70} />
            <h3 className='font-bold font-sans text-3xl'>Taper</h3>
          </div>
        </Link>

        <Link href={'/'}>
          <p className='text-muted-foreground'>How it works</p>
        </Link>
        <Link href={'/'}>
          <p className='text-muted-foreground'>About</p>
        </Link>
      </div>

      <div className='space-x-2'>
        <Link href={'/login'}>
          <Button variant={'outline'} className={'px-5 py-4 text-md'}>Log in</Button>
        </Link>
        <Link href={'/get-started'}>
          <Button className={'px-5 py-4 text-md'}>Sign up</Button>
        </Link>
      </div>
    </nav>
  )
}

function HeroSection() {

  return (
    <div>
      <div>
        <h1 className='font-bold text-7xl'>
          Training that builds to
          <br /> race day.
        </h1>
        <p className='text-muted-foreground'>
          Coaches build the program. Athletes follow it, log every session, <br />
          and see their own progress. Taper keeps both <br /> in  step, week by week.
        </p>

        <div className='flex items-center gap-2'>
          <Button
            variant="outline"
            className="h-auto flex-col items-start gap-0 p-3 text-left whitespace-normal"
          >
            <h4 className="text-lg font-semibold">{"I'm a coach"}</h4>
            <p className="text-xs font-normal text-muted-foreground">
              Builds programs and tracks your squad
            </p>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-start gap-0 p-3 text-left whitespace-normal"
          >
            <h4 className="text-lg font-semibold">{"I'm an athlete"}</h4>
            <p className="text-xs font-normal text-muted-foreground">
              Follow your program and log sessions
            </p>
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Iloilo Track Club</CardTitle>
            <CardAction><p className='text-muted-foreground'>14 athletes · nearest meet first</p></CardAction>
          </CardHeader>
          <CardContent>
            <Separator />
          </CardContent>
        </Card>
        <Card></Card>
      </div>
    </div>
  )

}

export default function Home() {

  return (

    <div>
      <Topbar />

      <div className='p-20'>
        <HeroSection />
      </div>
    </div>

  )

}