"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAgentConfig, toggleAgent, updateAgentConfig } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import type { AgentConfig } from "@/types"

export function useAgentConfig() {
  return useQuery({
    queryKey: ["agent-config"],
    queryFn: getAgentConfig,
    staleTime: 60_000,
  })
}

export function useUpdateAgentConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<AgentConfig>) => updateAgentConfig(data),
    onMutate: async (data) => {
      await qc.cancelQueries({ queryKey: ["agent-config"] })
      const prev = qc.getQueryData<AgentConfig>(["agent-config"])
      qc.setQueryData<AgentConfig>(["agent-config"], (old) =>
        old ? { ...old, ...data } : old
      )
      return { prev }
    },
    onError: (err: Error, _, ctx: any) => {
      qc.setQueryData(["agent-config"], ctx?.prev)
      toast.error(err.message || "Failed to update agent config")
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["agent-config"] }),
    onSuccess: () => toast.success("Agent configuration saved!"),
  })
}

export function useToggleAgent() {
  const qc = useQueryClient()
  const store = useAuthStore()
  return useMutation({
    mutationFn: toggleAgent,
    onSuccess: (data) => {
      if (store.doctor) {
        store.setDoctor({ ...store.doctor, is_agent_active: data.is_agent_active })
      }
      qc.invalidateQueries({ queryKey: ["me"] })
      toast.success(data.message)
    },
    onError: (err: Error) => toast.error(err.message || "Failed to toggle agent"),
  })
}
