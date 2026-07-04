interface SparklineProps {
  values: number[]
}

export function Sparkline({ values }: SparklineProps) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm ${i === values.length - 1 ? "bg-cyan-500" : "bg-red-500"} opacity-60 transition-opacity duration-150 group-hover/card:opacity-100`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}
