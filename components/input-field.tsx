

import { ComponentProps } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InputFieldProps extends ComponentProps<"input"> {
  label: string
  error?: string
}

export default function InputField({ label, error, ...props }: InputFieldProps) {

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input aria-invalid={!!error} {...props} />
      {error && <p className="m-0 text-sm text-destructive">{error}</p>}
    </div>
  )
}
