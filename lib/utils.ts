export { cn } from "cn"

export function capitalize(word: string): string {
  return (
    word
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  )
}