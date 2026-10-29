import { HeaderSkeleton, LoadingShell, TableSkeleton } from "@/components/loading-skeletons"

export default function Loading() {
  return (
    <LoadingShell label="Loading programs">
      <HeaderSkeleton withAction />
      <TableSkeleton cols={4} />
    </LoadingShell>
  )
}
