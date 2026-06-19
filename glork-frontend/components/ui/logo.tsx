import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Hyperglork"
      className={cn("h-8 w-8", className)}
      {...props}
    />
  )
}
