const NANOSECOND = 1
const MICROSECOND = 1e3 * NANOSECOND
const MILLISECOND = 1e3 * MICROSECOND
const SECOND = 1e3 * MILLISECOND

/**
 * Formats a duration in nanoseconds to a human-readable string.
 *
 * @param durationInNanoseconds - The duration in nanoseconds to format.
 *
 * @returns A string representing the formatted duration.
 */
export function formatDuration(durationInNanoseconds: number): string {
  if (durationInNanoseconds >= SECOND) {
    return `${(durationInNanoseconds / SECOND).toPrecision(2)}s`
  } else if (durationInNanoseconds >= MILLISECOND) {
    return `${(durationInNanoseconds / MILLISECOND).toPrecision(4)}ms`
  } else if (durationInNanoseconds >= MICROSECOND) {
    return `${(durationInNanoseconds / MICROSECOND).toPrecision(4)}µs`
  } else {
    return `${durationInNanoseconds.toPrecision(4)}ns`
  }
}

/**
 * Returns the name of the formatting method for a given format string.
 *
 * @param format - The format string to get the formatting method name for.
 *
 * @returns The name of the formatting method.
 */
export function getFormattingMethodName(format: string): string {
  return `format${format.charAt(0).toUpperCase() + format.slice(1)}`
}
