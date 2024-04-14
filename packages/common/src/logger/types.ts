export type LoggerParams = {
  log: string
  type: "info" | "success" | "error" | "start" | "end"
  step?: string
  group?: string
  stream?: boolean
  meta?: Record<string, unknown>
}

export interface Logger {
  log(params: LoggerParams): void
  end(): void
}
