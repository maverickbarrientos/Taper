import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading form">
      <HeaderSkeleton />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <CardSkeleton rows={5} />
        <CardSkeleton rows={5} />
      </div>
    </LoadingShell>
  )
}
