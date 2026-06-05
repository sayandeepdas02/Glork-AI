import type { Metadata } from "next"
import DashboardClient from "./DashboardClient"

export const metadata: Metadata = { title: "Dashboard · Glork" }

export default function DashboardPage() {
  return <DashboardClient />
}
