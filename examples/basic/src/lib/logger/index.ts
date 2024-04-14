import { pino } from "pino"

const customLevels = {
  http: 35 // same as `info`
}

const logTransport =
  process.env?.["NODE_ENV"] !== "production" ?
    {
      target: "pino-pretty",
      options: {
        colorize: true,
        customLevels: "http:35",
        customColors: "http:gray",
        colorizeObjects: true,
        ignore: "request,response",
        useOnlyCustomProps: false,
        messageKey: "message",
        errorKey: "error",
        timestampKey: "ts"
      }
    }
  : undefined

export const logger = pino({
  level: process.env?.["LOG_LEVEL"] ?? "info",
  messageKey: "message",
  name: "MAGIC",
  errorKey: "error",
  timestamp: () => `,"ts":"${Date.now()}"`,
  formatters: {
    level: label => {
      return { level: label }
    }
  },
  customLevels: customLevels,
  transport: logTransport
})

export * from "./types"
export * from "./utils"
