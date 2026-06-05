import type { Metadata } from "next"
import BookingDetailClient from "./BookingDetailClient"

export const metadata: Metadata = { title: "Booking · Glork" }

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return <BookingDetailClient id={params.id} />
}
