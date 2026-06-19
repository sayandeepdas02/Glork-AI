import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-[#d8e2ef] bg-white/95 px-4 py-2.5 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition-all placeholder:text-ink-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
