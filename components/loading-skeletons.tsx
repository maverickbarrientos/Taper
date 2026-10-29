import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3" aria-hidden>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      {withAction && <Skeleton className="h-9 w-32" />}
    </div>
  )
}

export function CardSkeleton({ rows = 3, className }: { rows?: number, className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 6, cols = 3 }: { rows?: number, cols?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton className="h-9 w-full sm:w-1/2 lg:w-1/4" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, c) => <Skeleton key={c} className="h-6" />)}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Wrapper that announces the busy state to assistive tech. */
export function LoadingShell({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="flex flex-col gap-5">
      {children}
    </div>
  )
}
