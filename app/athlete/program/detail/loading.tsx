import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading program details">
      <HeaderSkeleton withAction />
      <div className="grid gap-5 lg:grid-cols-2">
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>
      <CardSkeleton rows={5} />
      <CardSkeleton rows={5} />
    </LoadingShell>
  )
}
