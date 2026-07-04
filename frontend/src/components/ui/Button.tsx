import type { ReactNode, ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cyan"
  children: ReactNode
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border-none transition-all duration-150 outline-none active:scale-97 focus-visible:shadow-[0_0_0_3px_var(--glow-red)]"
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-zinc-700/50 text-zinc-100 border border-zinc-600 hover:bg-zinc-600",
    ghost: "bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50",
    cyan: "bg-cyan-500 text-white hover:bg-cyan-600",
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
