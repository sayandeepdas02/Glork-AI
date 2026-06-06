import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  /** variant: "color" = yellow bg + black mark, "dark" = dark bg + yellow mark, "light" = white bg + dark mark */
  variant?: "color" | "dark" | "light"
}

export function Logo({ className, variant = "color", ...props }: LogoProps) {
  const bg   = variant === "color" ? "#F5E542" : variant === "dark" ? "#0A0A0A" : "#FFFFFF"
  const mark = variant === "color" ? "#0A0A0A" : variant === "dark" ? "#F5E542" : "#0A0A0A"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 84 100"
      fill="none"
      className={cn("w-8 h-[38px]", className)}
      {...props}
    >
      <rect width="84" height="100" fill={bg} />

      {/* Upper-left arm */}
      <path d="M14 11 L39 46" stroke={mark} strokeWidth="17" strokeLinecap="round" />
      {/* Upper-right arm */}
      <path d="M70 11 L45 46" stroke={mark} strokeWidth="17" strokeLinecap="round" />
      {/* Lower-right arm */}
      <path d="M70 89 L45 54" stroke={mark} strokeWidth="17" strokeLinecap="round" />
      {/* Lower-left arm */}
      <path d="M14 89 L39 54" stroke={mark} strokeWidth="17" strokeLinecap="round" />

      {/* Center diamond gap — yellow/bg fill creates the twist illusion */}
      <polygon points="42,44 49,50 42,56 35,50" fill={bg} />
    </svg>
  )
}

/** Wordmark: logo mark + "Hyperglork" text side by side */
export function LogoWordmark({
  className,
  variant = "color",
}: {
  className?: string
  variant?: "color" | "dark" | "light"
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo variant={variant} className="w-7 h-[33px]" />
      <span
        className={cn(
          "text-[17px] font-semibold tracking-tight",
          variant === "dark" ? "text-white" : "text-[#0A0A0A]"
        )}
      >
        Hyperglork
      </span>
    </div>
  )
}
