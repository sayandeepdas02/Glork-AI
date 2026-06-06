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
      className={cn("w-8 h-8", className)}
      {...props}
    >
      {/* Yellow background */}
      <rect width="100" height="100" fill="#F5E040" />
      {/* Left vertical bar */}
      <rect x="11" y="11" width="26" height="78" rx="7" fill="#0F0F0F" />
      {/* Right vertical bar */}
      <rect x="63" y="11" width="26" height="78" rx="7" fill="#0F0F0F" />
      {/* Diagonal crossbar 1: top-left to bottom-right */}
      <polygon points="37,33 63,47 63,67 37,53" fill="#0F0F0F" />
      {/* Diagonal crossbar 2: top-right to bottom-left */}
      <polygon points="37,47 63,33 63,53 37,67" fill="#0F0F0F" />
    </svg>
  )
}
