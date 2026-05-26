"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createBooking,
  deleteBooking,
  getBooking,
  getBookings,
  getBookingStats,
  updateBooking,
} from "@/lib/api"
import type { BookingFilters, CreateBookingData, UpdateBookingData } from "@/types"

export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => getBookings(filters),
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBooking(id),
    staleTime: 60_000,
    enabled: !!id,
  })
}

export function useBookingStats() {
  return useQuery({
    queryKey: ["booking-stats"],
    queryFn: getBookingStats,
    staleTime: 60_000,
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookingData) => createBooking(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] })
      qc.invalidateQueries({ queryKey: ["booking-stats"] })
      toast.success("Booking created successfully!")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create booking"),
  })
}

export function useUpdateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingData }) =>
      updateBooking(id, data),
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: ["bookings", id] })
      const previous = qc.getQueryData(["bookings", id])
      qc.setQueryData(["bookings", id], (old: any) => ({ ...old, ...data }))
      return { previous }
    },
    onError: (err: Error, { id }, ctx: any) => {
      qc.setQueryData(["bookings", id], ctx?.previous)
      toast.error(err.message || "Failed to update booking")
    },
    onSettled: (_, __, { id }) => {
      qc.invalidateQueries({ queryKey: ["bookings"] })
      qc.invalidateQueries({ queryKey: ["bookings", id] })
      qc.invalidateQueries({ queryKey: ["booking-stats"] })
    },
    onSuccess: () => toast.success("Booking updated!"),
  })
}

export function useDeleteBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] })
      toast.success("Booking deleted")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete booking"),
  })
}
