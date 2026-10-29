'use client'

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { TrendPoint } from "@/types/analytics"
import { LOW_COMPLIANCE_THRESHOLD, formatCompliance } from "@/lib/analytics"

const W = 600, H = 220, PAD = { t: 12, r: 12, b: 28, l: 36 }

/** Weekly compliance line. null weeks are gaps (never 0%); a point with no adjacent neighbours renders as a dot only. */
export function TrendChart({ data }: { data: TrendPoint[] }) {
  const [hover, setHover] = useState<number | null>(null)

  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const x = (i: number) => PAD.l + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.t + (1 - v / 100) * innerH

  const segments: { i: number, v: number }[][] = [[]]
  data.forEach((p, i) => {
    if (p.compliance === null) segments.push([])
    else segments[segments.length - 1].push({ i, v: p.compliance })
  })
  const lines = segments.filter((s) => s.length > 1)

  const hovered = hover !== null ? data[hover] : null
  const summary = data.map((p) => `${format(parseISO(p.weekStart), "MMM d")} ${formatCompliance(p.compliance)}`).join(", ")

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Weekly compliance: ${summary}`}>
        {[0, 50, 100].map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--border)" />
            <text x={PAD.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">{t}%</text>
          </g>
        ))}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(LOW_COMPLIANCE_THRESHOLD)} y2={y(LOW_COMPLIANCE_THRESHOLD)}
          stroke="var(--destructive)" strokeDasharray="4 4" opacity={0.6} />

        {lines.map((s, k) => (
          <polyline key={k} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
            points={s.map(({ i, v }) => `${x(i)},${y(v)}`).join(" ")} />
        ))}
        {data.map((p, i) => p.compliance !== null && (
          <circle key={p.weekStart} cx={x(i)} cy={y(p.compliance)} r={hover === i ? 5 : 3.5}
            fill={p.compliance < LOW_COMPLIANCE_THRESHOLD ? "var(--destructive)" : "var(--primary)"} />
        ))}
        {data.map((p, i) => (
          <text key={p.weekStart} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
            {format(parseISO(p.weekStart), "MMM d")}
          </text>
        ))}
        {data.map((p, i) => (
          <rect key={p.weekStart} x={x(i) - innerW / data.length / 2} y={PAD.t} width={innerW / data.length} height={innerH}
            fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
      </svg>

      {hovered && hover !== null && (
        <div className="pointer-events-none absolute z-10 rounded-md bg-foreground px-3 py-1.5 text-xs text-background"
          style={{ left: `${(x(hover) / W) * 100}%`, top: 0, transform: "translateX(-50%)" }}>
          <p className="m-0 font-medium">Week of {format(parseISO(hovered.weekStart), "MMM d")}</p>
          <p className="m-0">
            {hovered.compliance === null
              ? "No data: nothing was due"
              : `${hovered.compliance}% (${hovered.logged} logged, ${hovered.missed} missed)`}
          </p>
        </div>
      )}
    </div>
  )
}
