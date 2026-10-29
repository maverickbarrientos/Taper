import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading progress">
      <HeaderSkeleton />
      <div className="grid gap-5 lg:grid-cols-3">
        <CardSkeleton rows={6} className="lg:col-span-2" />
        <div className="flex flex-col gap-5">
          <CardSkeleton rows={3} />
          <CardSkeleton rows={2} />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </div>
    </LoadingShell>
  )
}
