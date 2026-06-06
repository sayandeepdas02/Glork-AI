import type { Metadata } from "next"
import CallsClient from "./CallsClient"

export const metadata: Metadata = { title: "Call History · Hyperglork" }

export default function CallsPage() {
  return <CallsClient />
}
