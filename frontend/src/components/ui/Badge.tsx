import type { ReactNode } from "react"

interface BadgeProps {
  variant?: "green" | "yellow" | "red"
  children: ReactNode
}

export function Badge({ variant = "green", children }: BadgeProps) {
  const colors = {
    green: "bg-green-500/15 text-green-500",
    yellow: "bg-yellow-500/15 text-yellow-500",
    red: "bg-red-500/15 text-red-500",
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${colors[variant]}`}>
      {children}
    </span>
  )
}
