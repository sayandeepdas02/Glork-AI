import type { Metadata } from "next"
import CallDetailClient from "./CallDetailClient"

export const metadata: Metadata = { title: "Call · Glork" }

export default function CallDetailPage({ params }: { params: { id: string } }) {
  return <CallDetailClient id={params.id} />
}
