"use client"

import { useState } from "react"
import { Check, Copy, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, copyToClipboard } from "@/lib/utils"

interface TranscriptLine {
  speaker: "agent" | "user" | "unknown"
  text: string
}

function parseTranscript(raw: string): TranscriptLine[] {
  return raw.split("\n").reduce<TranscriptLine[]>((acc, line) => {
    const trimmed = line.trim()
    if (!trimmed) return acc
    if (/^agent:/i.test(trimmed)) {
      acc.push({ speaker: "agent", text: trimmed.replace(/^agent:\s*/i, "") })
    } else if (/^user:|^patient:/i.test(trimmed)) {
      acc.push({ speaker: "user", text: trimmed.replace(/^(user|patient):\s*/i, "") })
    } else {
      if (acc.length > 0) {
        acc[acc.length - 1].text += " " + trimmed
      } else {
        acc.push({ speaker: "unknown", text: trimmed })
      }
    }
    return acc
  }, [])
}

interface TranscriptViewerProps {
  transcript: string | null | undefined
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!transcript) return
    const ok = await copyToClipboard(transcript)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!transcript) {
    return (
      <Card className="rounded-2xl border border-gray-100 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-3">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No transcript available for this call.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const lines = parseTranscript(transcript)

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Transcript</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1.5 text-xs text-gray-500 hover:text-gray-900"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </Button>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#1d6b4a]" />
            AI Agent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
            Patient
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[480px] pr-3">
          <div className="space-y-3 py-1">
            {lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  line.speaker === "agent" ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    line.speaker === "agent"
                      ? "bg-[#f0faf5] text-[#1d4a33] rounded-tl-sm"
                      : line.speaker === "user"
                        ? "bg-gray-100 text-gray-800 rounded-tr-sm"
                        : "bg-gray-50 text-gray-600 italic text-xs"
                  )}
                >
                  {line.speaker === "agent" && (
                    <p className="text-[10px] font-semibold text-[#1d6b4a] mb-0.5 uppercase tracking-wide">
                      AI Agent
                    </p>
                  )}
                  {line.speaker === "user" && (
                    <p className="text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">
                      Patient
                    </p>
                  )}
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
