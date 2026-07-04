interface SkeletonProps {
  className?: string
  noAnimation?: boolean
}

export function Skeleton({ className = "", noAnimation }: SkeletonProps) {
  const anim = noAnimation ? "animate-none" : "animate-pulse"
  return (
    <div
      className={`rounded-md bg-zinc-700/50 ${anim} ${className}`}
    />
  )
}
