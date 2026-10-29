
import { Input } from "@/components/ui/input"

export default function Searchbar ({ className }: { className?: string }) {

  return (
    <Input 
      placeholder="Search..."
      className={className}
    />
  )

}