"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useUIStore } from "@/store/ui-store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div className="flex min-h-screen bg-transparent">
      <aside className="hidden w-[310px] shrink-0 border-r border-white/70 bg-white/65 shadow-[18px_0_60px_rgba(12,24,41,0.04)] backdrop-blur-xl lg:flex">
        <Sidebar />
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[310px] border-r-0 p-0">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
