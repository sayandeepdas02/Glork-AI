import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-start justify-between gap-4 rounded-[30px] border border-black/6 bg-white px-6 py-6 shadow-[0_16px_30px_rgba(17,17,17,0.04)]", className)}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
        {description && <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  )
}
