import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      <label className="block font-mono text-xs font-medium uppercase tracking-wider text-dark-400 mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 bg-dark-950 border border-dark-800 rounded-lg text-dark-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus-visible:shadow-[0_0_0_3px_var(--glow-red-focus)] placeholder:text-dark-400 ${className}`}
        {...props}
      />
    </div>
  )
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div>
      <label className="block font-mono text-xs font-medium uppercase tracking-wider text-dark-400 mb-2">
        {label}
      </label>
      <textarea
        className={`w-full px-4 py-3 bg-dark-950 border border-dark-800 rounded-lg text-dark-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus-visible:shadow-[0_0_0_3px_var(--glow-red-focus)] placeholder:text-dark-400 resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
