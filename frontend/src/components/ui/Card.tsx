import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  ghost?: boolean
  hover?: boolean
  padding?: boolean
}

export function Card({ children, className = "", ghost, hover = true, padding = true }: CardProps) {
  if (ghost) {
    return (
      <div
        className={`border-2 border-dashed border-dark-700 hover:border-red-500 hover:bg-red-500/10 rounded-xl ${padding ? "p-6" : ""} transition-all duration-200 cursor-pointer ${className}`}
      >
        {children}
      </div>
    )
  }
  return (
    <div
      className={`bg-[var(--color-bg-secondary)] border border-dark-700 rounded-xl ${padding ? "p-6" : ""} ${hover ? "hover:border-dark-400 transition-all duration-200" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
