import { complianceTone, formatCompliance } from "@/lib/analytics"

const strokeByTone = {
  none: "var(--muted-foreground)",
  low: "var(--destructive)",
  mid: "var(--warning)",
  high: "var(--primary)",
}

export function ComplianceRing({ value, size = 96, label }: { value: number | null, size?: number, label: string }) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = complianceTone(value)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${formatCompliance(value)}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        {value !== null && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={strokeByTone[tone]} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
        {value === null ? <span className="text-muted-foreground text-xs font-normal">No data</span> : `${value}%`}
      </span>
    </div>
  )
}
