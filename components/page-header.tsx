
import { Badge } from "@/components/ui/badge"

type PageHeaderProps = {
  heading: string
  subHeading?: string
  children?: React.ReactNode
  badge?: boolean
  badgeName?: string
}

export default function PageHeader({ heading, subHeading, children, badge, badgeName }: PageHeaderProps) {

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1>{heading}</h1>
          {badge && (
            <Badge variant={'default'}>
              {badgeName}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground m-0">{subHeading}</p>
      </div>
      {children}
    </div>
  )

}