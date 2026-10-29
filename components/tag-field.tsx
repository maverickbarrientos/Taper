'use client'

import { useState } from "react"
import { PlusIcon, XIcon } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TagFieldProps = {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

// Free-text list: each entry is a badge, and the + button reveals an input to add another.
export default function TagField({ label, value, onChange, placeholder }: TagFieldProps) {

  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState("")

  function commit() {
    const entry = draft.trim()
    if (entry && !value.includes(entry)) onChange([...value, entry])
    setDraft("")
    return entry
  }

  function close() {
    setDraft("")
    setAdding(false)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        {value.map((entry, index) => (
          <Badge key={`${entry}-${index}`} variant="secondary" className="h-6 gap-1 pr-1">
            {entry}
            <button
              type="button"
              aria-label={`Remove ${entry}`}
              className="rounded-full p-0.5 hover:bg-foreground/10"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              <XIcon size={12} />
            </button>
          </Badge>
        ))}

        {adding && (
          <Input
            autoFocus
            value={draft}
            placeholder={placeholder}
            aria-label={`Add ${label.toLowerCase()}`}
            className="h-7 w-56"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault() // don't submit the surrounding form
                commit()
              } else if (event.key === "Escape") {
                event.stopPropagation()
                close()
              }
            }}
            onBlur={() => { commit(); close() }}
          />
        )}

        {/* Stays visible so it's clear more than one entry can be added. */}
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Add ${label.toLowerCase()}`}
          onMouseDown={(event) => event.preventDefault()} // keep the input focused
          onClick={() => {
            if (adding) commit()
            else setAdding(true)
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <p className="m-0 text-xs text-muted-foreground">
        {adding ? "Press Enter or + to add another." : value.length === 0 ? "Press + to add one." : "Press + to add more."}
      </p>
    </div>
  )

}
