'use client'

import { ComponentProps, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

interface PasswordFieldProps extends Omit<ComponentProps<"input">, "type"> {
  label: string
  error?: string
}

export default function PasswordField({ label, error, ...props }: PasswordFieldProps) {

  const [visible, setVisible] = useState(false)

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <InputGroup>
        <InputGroupInput
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
          >
            {visible ? <EyeSlashIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {error && <p className="m-0 text-sm text-destructive">{error}</p>}
    </div>
  )
}
