import { create } from "zustand"
import type { BookingFilters, CallFilters } from "@/types"

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  bookingFilters: BookingFilters
  setBookingFilters: (filters: Partial<BookingFilters>) => void
  callFilters: CallFilters
  setCallFilters: (filters: Partial<CallFilters>) => void
  commandOpen: boolean
  setCommandOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  bookingFilters: { page: 1, limit: 20 },
  setBookingFilters: (filters) =>
    set((s) => ({ bookingFilters: { ...s.bookingFilters, ...filters } })),
  callFilters: { page: 1, limit: 20 },
  setCallFilters: (filters) =>
    set((s) => ({ callFilters: { ...s.callFilters, ...filters } })),
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
}))
