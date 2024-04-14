import { performance } from "node:perf_hooks"
import readline from "node:readline"
import chalk from "chalk"
import cliSpinners from "cli-spinners"
import wrapAnsi from "wrap-ansi"

const MAX_LINE_WIDTH = Math.floor(process.stdout.columns * 0.8)

const kDefaultSpinnerName = "dots" satisfies cliSpinners.SpinnerName
const kLogSymbols = {
  success: chalk.greenBright("✔"),
  error: chalk.redBright("✖")
}

export interface SpinnerOptions {
  name?: cliSpinners.SpinnerName
}

export interface StartOptions {
  withPrefix?: string
}

export class Spinner {
  private stream: typeof process.stdout
  private spinner: cliSpinners.Spinner
  private interval: ReturnType<typeof setInterval> | null = null
  private frameIndex = 0
  private startTime = 0
  private text = ""
  private prefix = ""

  private started = false
  private steps: string[] = []

  constructor(options: SpinnerOptions = {}) {
    this.stream = process.stdout
    const { name = kDefaultSpinnerName } = options
    this.spinner = name in cliSpinners ? cliSpinners[name] : cliSpinners[kDefaultSpinnerName]
  }

  get elapsedTime(): string {
    return ((performance.now() - this.startTime) / 1000).toFixed(2)
  }

  setText(value: string | undefined) {
    if (typeof value === "string") {
      this.text = value
    }
  }

  getText(): string {
    return this.text
  }

  addStep(step: string): void {
    this.steps.push(step)
  }

  start(text?: string, options: StartOptions = {}): this {
    this.started = true
    this.setText(text)
    this.prefix = options.withPrefix || ""
    this.startTime = performance.now()
    this.frameIndex = 0
    this.renderSpinner()
    this.interval = setInterval(() => this.renderSpinner(), this.spinner.interval)

    return this
  }

  stop(text?: string): this {
    if (!this.started) {
      return this
    }

    this.setText(text)
    this.started = false

    if (this.interval !== null) {
      clearInterval(this.interval)
    }

    return this
  }

  succeed(text?: string): this {
    if (!this.started) {
      return this
    }

    this.stop(text)
    this.renderSymbol(kLogSymbols.success)

    return this
  }

  complete(text?: string): this {
    if (!this.started) {
      return this
    }

    this.stop(text)
    this.renderSymbol("")

    return this
  }

  failed(text?: string): this {
    if (!this.started) {
      return this
    }

    this.stop(text)
    this.renderSymbol(kLogSymbols.error)

    return this
  }

  private getSpinnerFrame(): string {
    const { frames } = this.spinner
    const frame = frames[this.frameIndex]
    this.frameIndex = ++this.frameIndex < frames.length ? this.frameIndex : 0

    return chalk.blueBright(frame)
  }

  private renderSpinner(): void {
    const wrappedText = wrapAnsi(this.text, MAX_LINE_WIDTH, { hard: true, trim: false })
    if (wrappedText.split("\n").length > 1) {
      const spinnerLine = ` ${chalk.dim(wrappedText.split("\n")[wrappedText.split("\n").length - 1])} `
      readline.cursorTo(this.stream, 0)
      readline.clearLine(this.stream, 0)
      this.stream.write(spinnerLine)
    } else {
      readline.cursorTo(this.stream, 0)
      readline.clearLine(this.stream, 0)
      const spinnerLine = `${this.getSpinnerFrame()} ${chalk.bold(this.prefix)} ${chalk.dim(this.text)}`
      this.stream.write(spinnerLine)
    }

    for (const step of this.steps) {
      this.stream.write(`\n ${chalk.greenBright("->")} ${chalk.dim(step)}`)
    }

    this.stream.write("")
  }

  private renderSymbol(symbol: string): void {
    readline.cursorTo(this.stream, 0)
    readline.clearLine(this.stream, 0)

    const wrappedText = wrapAnsi(this.text, MAX_LINE_WIDTH, { hard: true, trim: false })
    const textLines = wrappedText.split("\n")

    const firstLine = textLines.shift() || ""
    const remainingLines = textLines

    const symbolLine = `${symbol} ${chalk.bold(this.prefix)} ${chalk.dim(firstLine)}`
    this.stream.write(symbolLine)

    for (const line of remainingLines) {
      this.stream.write(`${chalk.dim(line)}\n`)
    }

    for (const step of this.steps) {
      this.stream.write(`\n ${chalk.greenBright("->")} ${chalk.dim(step)}`)
    }

    this.stream.write("\n\n")
    this.stream.write("")
  }
}
