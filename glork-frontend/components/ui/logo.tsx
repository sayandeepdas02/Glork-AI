import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <rect width="100" height="100" rx="26" fill="#1C80F2" />
      <rect x="15" y="14" width="18" height="72" rx="9" fill="#F8FBFF" />
      <rect x="67" y="14" width="18" height="72" rx="9" fill="#F8FBFF" />
      <path d="M33 34L67 52V66L33 48V34Z" fill="#F8FBFF" />
      <path d="M33 52L67 34V48L33 66V52Z" fill="#F8FBFF" />
    </svg>
  )
}
