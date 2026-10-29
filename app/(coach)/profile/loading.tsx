import { CardSkeleton, HeaderSkeleton, LoadingShell } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading profile">
      <HeaderSkeleton />
      <CardSkeleton rows={4} />
    </LoadingShell>
  )
}
