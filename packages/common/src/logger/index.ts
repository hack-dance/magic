/**
 * LogGenerator Class
 *
 * This class handles log entries. It allows writing log entries into a queue,
 * reading from the queue in an asynchronous iterable way, and controlling the reading state.
 *
 * @class
 */

export class LogGenerator<LogEntry extends { log: string }> {
  private logQueue: LogEntry[] = []
  private resolve: ((value?: unknown) => void) | null = null
  private reading = false
  private readingStopped = false

  /**
   * Writes a log entry to the queue.
   *
   * @method
   * @param {LogEntry} logEntry - The log entry to write.
   *
   * @example
   *
   * const logGenerator = new LogGenerator<{ log: string; group?: string; type?: string }>();
   * logGenerator.write({ log: "Starting process...", group: "ProcessLogs", type: "start" });
   */
  public write(logEntry: LogEntry) {
    this.logQueue.push(logEntry)
    this.resolve && this.resolve()
  }

  /**
   * Returns an asynchronous generator that yields log entries as they become available.
   *
   * @async
   * @generator
   * @yields {LogEntry} logEntry - The log entry.
   *
   * @example
   *
   * const logGenerator = new LogGenerator<{ log: string; group?: string; type?: string }>();
   * logGenerator.startReading();
   * for await (const entry of logGenerator.read()) {
   *   console.log(entry.log);
   * }
   */
  public async *read(): AsyncGenerator<LogEntry> {
    while (true) {
      if (this.logQueue.length > 0) {
        yield this.logQueue.shift()!
      } else if (this.readingStopped) {
        this.reading = false
        return
      } else {
        await new Promise(resolve => (this.resolve = resolve))
      }
    }
  }

  /**
   * Indicates that the LogGenerator should start yielding log entries.
   *
   * @method
   *
   * @example
   *
   * const logGenerator = new LogGenerator();
   * logGenerator.startReading();
   *
   */
  public startReading() {
    this.readingStopped = false
    this.reading = true
  }

  /**
   * Indicates that the LogGenerator should stop yielding log entries.
   *
   * @method
   *
   * @example
   *
   * const logGenerator = new LogGenerator();
   * logGenerator.startReading();
   * // ... later ...
   * logGenerator.stopReading();
   *
   */
  public stopReading() {
    this.readingStopped = true
    this.reading = false
  }

  /**
   * Returns the current reading state of the LogGenerator.
   *
   * @method
   * @returns {boolean} - `true` if currently reading, `false` otherwise.
   *
   * @example
   *
   * const logGenerator = new LogGenerator();
   * logGenerator.startReading();
   * console.log(logGenerator.isReading());  // Outputs: true
   * logGenerator.stopReading();
   * console.log(logGenerator.isReading());  // Outputs: false
   *
   */
  public isReading() {
    return this.reading
  }
}
