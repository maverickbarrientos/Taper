import { format, parseISO } from "date-fns"

const W = 600, H = 200, PAD = { t: 16, r: 8, b: 28, l: 8 }

export function VolumeChart({ data }: { data: { weekStart: string, sets: number, reps: number }[] }) {
  const max = Math.max(...data.map((d) => d.reps), 1)
  const innerH = H - PAD.t - PAD.b
  const slot = (W - PAD.l - PAD.r) / data.length
  const barW = slot * 0.6

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
      aria-label={`Approximate weekly reps: ${data.map((d) => `${format(parseISO(d.weekStart), "MMM d")} ${d.reps}`).join(", ")}`}>
      {data.map((d, i) => {
        const h = (d.reps / max) * innerH
        const cx = PAD.l + slot * i + slot / 2
        return (
          <g key={d.weekStart}>
            <title>{`Week of ${format(parseISO(d.weekStart), "MMM d")}: ~${d.reps} reps across ${d.sets} sets`}</title>
            <rect x={cx - barW / 2} y={PAD.t + innerH - h} width={barW} height={d.reps > 0 ? Math.max(h, 2) : 0} rx={3} fill="var(--primary)" opacity={0.85} />
            {d.reps > 0 && <text x={cx} y={PAD.t + innerH - h - 4} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">~{d.reps}</text>}
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{format(parseISO(d.weekStart), "MMM d")}</text>
          </g>
        )
      })}
    </svg>
  )
}
