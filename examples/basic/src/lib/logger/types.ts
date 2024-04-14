import { Log } from "./log"

type LogFormatString = {
  [K in keyof typeof Log.prototype as K extends `format${infer Rest}` ? Lowercase<Rest>
  : never]: (typeof Log.prototype)[K]
}

type LogFormatRecord = Record<Uppercase<keyof LogFormatString>, string>

export const LogFormat = {
  JSON: "json",
  COMMON: "common",
  SHORT: "short"
} as const

export type LogFormatType = keyof LogFormatString | LogFormatRecord

/**
 * Common Logger interface.
 */
export interface Logger {
  debug: <T extends unknown[]>(...args: T) => void
  info: <T extends unknown[]>(...args: T) => void
  warn: <T extends unknown[]>(...args: T) => void
  error: <T extends unknown[]>(...args: T) => void
}
