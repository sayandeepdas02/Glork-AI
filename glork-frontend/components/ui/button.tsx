import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:     "bg-[#111111] text-white hover:bg-[#333333]",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
        outline:     "border border-[#E5E7EB] bg-white text-[#333333] hover:bg-[#F9FAFB] hover:border-[#D1D5DB]",
        secondary:   "bg-[#F3F4F6] text-[#333333] hover:bg-[#E5E7EB]",
        ghost:       "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111111]",
        link:        "text-[#1C80F2] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-7 px-3 text-[12px]",
        lg:      "h-11 px-5 text-[14px]",
        icon:    "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
