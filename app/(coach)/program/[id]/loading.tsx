import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading program">
      <HeaderSkeleton withAction />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6 lg:order-1">
          <CardSkeleton rows={6} />
        </div>
        <aside className="flex flex-col gap-6 lg:order-2">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={3} />
        </aside>
      </div>
    </LoadingShell>
  )
}
