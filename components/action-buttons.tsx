'use client'

import { useRouter } from "next/navigation"
import { PlusIcon, ArrowLeftIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

type ButtonProps = {
  label: string
  onClick?: () => void
}

export function AddButton ({ label, onClick }: ButtonProps) {

  return (
    <Button 
      onClick={onClick}
      className={"flex items-center gap-2"}
    >
      <PlusIcon />
      {label}
    </Button>
  )

}

export function BackButton({ label }: ButtonProps) {

  const router = useRouter();

  return (
    <Button 
      variant={'link'}
      onClick={() => router.back()}
      className={'flex items-center gap-2'}
    >
      <ArrowLeftIcon />
      {label}
    </Button>
  )
}

type EditButtonProps = ButtonProps & { href: string }

export function EditButton({ label, href }: EditButtonProps) {

  const router = useRouter();

  return (
    <Button 
      variant={'outline'}
      onClick={() => router.push(href)}
      className={'flex items-center gap-2'}
    >
      <PencilSimpleIcon />
      {label}
    </Button>
  )
}