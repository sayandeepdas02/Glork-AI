import type { Metadata } from "next"
import BookingsClient from "./BookingsClient"

export const metadata: Metadata = { title: "Bookings · Glork" }

export default function BookingsPage() {
  return <BookingsClient />
}
