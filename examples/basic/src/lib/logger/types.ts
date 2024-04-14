export const LogFormat = {
  JSON: "json",
  COMMON: "common",
  SHORT: "short"
} as const

/**
 * Common Logger interface.
 */
export interface Logger {
  debug: <T extends unknown[]>(...args: T) => void
  info: <T extends unknown[]>(...args: T) => void
  log: <T extends unknown[]>(...args: T) => void
  warn: <T extends unknown[]>(...args: T) => void
  error: <T extends unknown[]>(...args: T) => void
}
