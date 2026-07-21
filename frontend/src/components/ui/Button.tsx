import type { ReactNode, ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cyan"
  children: ReactNode
}

const base = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border-none transition-all duration-150 outline-none active:scale-97 focus-visible:shadow-[0_0_0_3px_var(--glow-red)]"
const variants = {
  primary: "bg-red-600 text-white hover:bg-red-700",
  secondary: "bg-dark-700/50 text-dark-100 border border-dark-800 hover:bg-dark-800",
  ghost: "bg-transparent text-dark-400 hover:text-dark-100 hover:bg-dark-700/50",
  cyan: "bg-cyan-500 text-white hover:bg-cyan-600",
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
