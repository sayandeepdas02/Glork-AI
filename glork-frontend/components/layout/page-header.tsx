import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight text-ink md:text-[2.4rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-ink-4">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  )
}
