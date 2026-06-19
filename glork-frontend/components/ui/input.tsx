import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-[13px] font-normal text-[#111111] transition-colors",
          "placeholder:text-[#D1D5DB]",
          "hover:border-[#D1D5DB]",
          "focus-visible:outline-none focus-visible:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#111111]/8",
          "disabled:cursor-not-allowed disabled:bg-[#FAFAFA] disabled:text-[#9CA3AF]",
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
