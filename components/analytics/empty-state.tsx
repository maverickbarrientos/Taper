import { type Icon } from "@phosphor-icons/react"

export function EmptyState({ icon: IconComp, title, description }: { icon: Icon, title: string, description?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-8 text-center">
      <IconComp size={28} className="text-muted-foreground" />
      <p className="m-0 font-medium">{title}</p>
      {description && <p className="text-muted-foreground m-0">{description}</p>}
    </div>
  )
}
