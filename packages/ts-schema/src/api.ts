export type TraceId = string

export type ApiMeta = {
  cursor?: string
  limit?: number
  [key: string]: unknown
}

export type ApiErrorDetail = {
  field?: string
  message: string
  code?: string
}

export type ProblemDetails = {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  trace_id?: TraceId
  errors?: ApiErrorDetail[]
}

export type ApiResponse<T> = {
  data: T | null
  error: ProblemDetails | null
  meta?: ApiMeta
  trace_id?: TraceId
}
