"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { BookingDetailCard } from "@/components/bookings/booking-detail-card"
import { useBooking } from "@/hooks/use-bookings"

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className ?? ""}`} />
}

export default function BookingDetailClient({ id }: { id: string }) {
  const { data: booking, isLoading, isError } = useBooking(id)

  return (
    <div className="space-y-5 max-w-2xl">
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Bookings
      </Link>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-80 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-600">Could not load this booking.</p>
          <Link href="/bookings" className="text-sm text-red-400 underline mt-2 inline-block">
            Back to bookings
          </Link>
        </div>
      )}

      {booking && <BookingDetailCard booking={booking} />}
    </div>
  )
}
