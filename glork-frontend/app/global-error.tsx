"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#F5F5F2" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111", margin: "0 0 6px" }}>
            Application error
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px", maxWidth: 300, lineHeight: 1.5 }}>
            A critical error occurred. Reload the page to continue.
          </p>
          <button
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 12,
              background: "#FF6B00",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
