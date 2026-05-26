export interface Doctor {
  id: string
  email: string
  name: string
  clinic_name: string
  phone_number: string | null
  specialty: string | null
  clinic_address: string | null
  is_active: boolean
  is_agent_active: boolean
  calendar_connected?: boolean
  created_at: string
  updated_at?: string | null
  agent_config?: AgentConfig | null
}

export interface DaySchedule {
  enabled: boolean
  start: string
  end: string
}

export interface WorkingHours {
  mon: DaySchedule
  tue: DaySchedule
  wed: DaySchedule
  thu: DaySchedule
  fri: DaySchedule
  sat: DaySchedule
  sun: DaySchedule
}

export interface AgentConfig {
  id: string
  doctor_id: string
  retell_agent_id: string | null
  retell_llm_id?: string | null
  glork_phone_number: string | null
  greeting_message: string
  working_hours: WorkingHours
  slot_duration_mins: number
  buffer_mins: number
  language: "en" | "hi" | "ta"
  emergency_transfer_number: string | null
  max_advance_booking_days: number
}

export type BookingStatus =
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "no_show"

export interface Booking {
  id: string
  doctor_id: string
  call_log_id: string | null
  patient_name: string
  patient_phone: string
  patient_email: string | null
  appointment_start: string
  appointment_end: string
  reason: string | null
  status: BookingStatus
  google_event_id: string | null
  sms_sent: boolean
  reminder_sent: boolean
  notes: string | null
  created_at: string
  updated_at?: string | null
}

export type CallOutcome =
  | "booked"
  | "enquiry"
  | "cancelled"
  | "rescheduled"
  | "transferred"
  | "failed"
  | "unanswered"

export interface CallLog {
  id: string
  doctor_id: string
  retell_call_id: string | null
  caller_phone: string | null
  duration_seconds: number | null
  transcript: string | null
  outcome: CallOutcome
  recording_url: string | null
  agent_summary: string | null
  started_at: string | null
  ended_at: string | null
  created_at: string
}

export interface CalendarStatus {
  is_connected: boolean
  calendar_id: string | null
  calendar_name: string | null
}

export interface DashboardStats {
  total_this_month: number
  confirmed_this_month: number
  cancelled_this_month: number
  no_show_this_month: number
  conversion_rate: number
}

export interface CallStats {
  total_calls: number
  total_duration_seconds: number
  calls_by_outcome: Record<CallOutcome, number>
  avg_duration_seconds: number
  calls_this_week: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface RegisterData {
  email: string
  password: string
  name: string
  clinic_name: string
  specialty?: string
}

export interface BookingFilters {
  date?: string
  status?: BookingStatus
  search?: string
  page?: number
  limit?: number
}

export interface CallFilters {
  outcome?: CallOutcome
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

export interface CreateBookingData {
  patient_name: string
  patient_phone: string
  patient_email?: string | null
  appointment_start: string
  appointment_end: string
  reason?: string | null
  notes?: string | null
}

export interface UpdateBookingData {
  status?: BookingStatus
  appointment_start?: string
  appointment_end?: string
  notes?: string | null
}
