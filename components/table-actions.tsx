'use client'

import Link from "next/link";
import { EyeIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export type TableActionsProps = {
  href: string
  editHref?: string
  deleteAction?: React.ReactNode
}

export default function TableActions({ href, editHref, deleteAction }: TableActionsProps) {

  return (
    <div className="flex items-center gap-1">
      <Button>
        <Link href={href}>
          <EyeIcon />
        </Link>
      </Button>
      <Button variant={'outline'}>
        {editHref ? (
          <Link href={editHref} aria-label="Edit">
            <PencilSimpleIcon />
          </Link>
        ) : (
          <PencilSimpleIcon />
        )}
      </Button>
      {deleteAction}
    </div>
  )

}