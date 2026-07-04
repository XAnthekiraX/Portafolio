import type { ReactNode } from "react"

interface TagProps {
  variant?: "default" | "red" | "cyan"
  children: ReactNode
  onClick?: () => void
}

export function Tag({ variant = "default", children, onClick }: TagProps) {
  const colors = {
    default: "border-zinc-600 text-zinc-400 bg-zinc-700/50 hover:border-cyan-500 hover:text-cyan-400",
    red: "border-red-500/30 text-red-500 bg-red-500/10",
    cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium font-mono border transition-all duration-150 ${colors[variant]} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
