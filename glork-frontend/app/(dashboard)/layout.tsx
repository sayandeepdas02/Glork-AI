"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useUIStore } from "@/store/ui-store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-surface)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-[var(--edge)] bg-[rgba(255,255,255,0.72)] backdrop-blur-md lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
