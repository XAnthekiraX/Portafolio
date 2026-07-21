interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={`w-full h-1.5 bg-dark-700/50 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-600 to-cyan-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
