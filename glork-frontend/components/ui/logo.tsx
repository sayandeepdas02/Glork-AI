import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      fill="none" 
      className={cn("w-8 h-8", className)} 
      {...props}
    >
      <rect width="200" height="200" fill="#FF5500" />
      <path 
        d="M170 95C170 133.66 138.66 165 100 165C84.773 165 70.6775 160.141 59.206 151.815L30 165L43.1848 135.794C34.8586 124.322 30 110.227 30 95C30 56.3401 61.3401 25 100 25C138.66 25 170 56.3401 170 95Z" 
        stroke="white" 
        strokeWidth="10" 
        strokeLinejoin="round"
      />
      
      {/* 9 Waveform Bars (Center at 100) */}
      <line x1="44" y1="95" x2="44" y2="95" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="44" y1="85" x2="44" y2="105" stroke="white" strokeWidth="8" strokeLinecap="round" />

      <line x1="58" y1="75" x2="58" y2="115" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="72" y1="60" x2="72" y2="130" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="86" y1="48" x2="86" y2="142" stroke="white" strokeWidth="8" strokeLinecap="round" />
      
      {/* Center Bar */}
      <line x1="100" y1="36" x2="100" y2="154" stroke="white" strokeWidth="8" strokeLinecap="round" />
      
      <line x1="114" y1="48" x2="114" y2="142" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="128" y1="60" x2="128" y2="130" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <line x1="142" y1="75" x2="142" y2="115" stroke="white" strokeWidth="8" strokeLinecap="round" />
      
      <line x1="156" y1="85" x2="156" y2="105" stroke="white" strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}
