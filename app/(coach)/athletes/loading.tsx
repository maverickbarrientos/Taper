import { HeaderSkeleton, LoadingShell, TableSkeleton } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading athletes">
      <HeaderSkeleton withAction />
      <TableSkeleton cols={3} />
    </LoadingShell>
  )
}
