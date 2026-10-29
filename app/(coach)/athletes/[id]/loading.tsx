import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading athlete">
      <HeaderSkeleton withAction />
      <div className="grid gap-5 lg:grid-cols-2">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </div>
      <CardSkeleton rows={5} />
    </LoadingShell>
  )
}
