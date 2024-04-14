#! /usr/bin/env bun
import { CliLogger } from "@common/logger/cli-logger"
import { Magic } from "@examples/basic/src"
import prompts from "prompts"

const logger = new CliLogger()
const magic = new Magic<typeof logger>()

async function ask(conversationId: string) {
  try {
    const question = await prompts({
      message: "Ask me anything...",
      type: "text",
      name: "prompt"
    })

    if (!question.prompt) {
      console.log("Exiting...")
      logger.end()
      return process.exit(0)
    }

    await magic.run({ conversationId, prompt: question.prompt, logger })
    logger.end()

    console.log("\n\n")

    await ask(conversationId)
  } catch (error) {
    console.error("An error occurred:", error)
    process.exit(1)
  }
}

async function main() {
  const conversationId = crypto.randomUUID()
  await ask(conversationId)
}

process.on("SIGTERM", () => {
  console.log("Exiting...")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("Exiting...")
  process.exit(0)
})

process.on("uncaughtException", error => {
  console.error("Uncaught Exception:", error)
  process.exit(1)
})

process.on("unhandledRejection", reason => {
  console.error("Unhandled Rejection:", reason)
  process.exit(1)
})

main().catch(error => {
  console.error("An error occurred in the main function:", error)
  process.exit(1)
})
