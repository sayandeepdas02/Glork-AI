"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopNav } from "@/components/layout/top-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useUIStore } from "@/store/ui-store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen bg-[#0C0A09] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/5">
        <Sidebar />
      </aside>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-60 p-0 border-0">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
