import type { ReactNode } from "react"

interface BadgeProps {
  variant?: "green" | "yellow" | "red"
  children: ReactNode
}

const colors = {
  green: "bg-green-500/15 text-green-500",
  yellow: "bg-yellow-500/15 text-yellow-500",
  red: "bg-red-500/15 text-red-500",
}

export function Badge({ variant = "green", children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors[variant]}`}>
      {children}
    </span>
  )
}
