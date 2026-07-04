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
      <label className="block font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-[13px] outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-400 ${className}`}
        {...props}
      />
    </div>
  )
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div>
      <label className="block font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
        {label}
      </label>
      <textarea
        className={`w-full px-3 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-[13px] outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-400 resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
