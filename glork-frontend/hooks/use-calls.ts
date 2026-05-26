"use client"

import { useQuery } from "@tanstack/react-query"
import { getCall, getCalls, getCallStats } from "@/lib/api"
import type { CallFilters } from "@/types"

export function useCalls(filters: CallFilters = {}) {
  return useQuery({
    queryKey: ["calls", filters],
    queryFn: () => getCalls(filters),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useCall(id: string) {
  return useQuery({
    queryKey: ["calls", id],
    queryFn: () => getCall(id),
    staleTime: 60_000,
    enabled: !!id,
  })
}

export function useCallStats() {
  return useQuery({
    queryKey: ["call-stats"],
    queryFn: getCallStats,
    staleTime: 60_000,
  })
}
