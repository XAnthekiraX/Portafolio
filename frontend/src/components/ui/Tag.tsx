import type { ReactNode } from "react"

interface TagProps {
  variant?: "default" | "red" | "cyan"
  children: ReactNode
  onClick?: () => void
}

const colors = {
  default: "border-dark-800 text-dark-400 bg-dark-700/50 hover:border-cyan-500 hover:text-cyan-400",
  red: "border-red-500/30 text-red-500 bg-red-500/10",
  cyan: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
}

export function Tag({ variant = "default", children, onClick }: TagProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium font-mono border transition-all duration-150 cursor-pointer ${colors[variant]}`}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium font-mono border transition-all duration-150 ${colors[variant]}`}
    >
      {children}
    </span>
  )
}
