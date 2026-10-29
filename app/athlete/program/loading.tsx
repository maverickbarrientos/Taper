import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading programs">
      <HeaderSkeleton />
      <div className="grid gap-5 lg:grid-cols-2">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>
    </LoadingShell>
  )
}
