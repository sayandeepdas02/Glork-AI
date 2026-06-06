import type { Metadata } from "next"
import BookingsClient from "./BookingsClient"

export const metadata: Metadata = { title: "Bookings · Hyperglork" }

export default function BookingsPage() {
  return <BookingsClient />
}
