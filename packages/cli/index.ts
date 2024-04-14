#! /usr/bin/env bun
import ora from "ora"
import prompts from "prompts"

import { magic } from "../../examples/basic/src/index.ts"

const spinner = ora()
let spinnerType: string | undefined = undefined

async function cb({
  content,
  type,
  shouldEnd = false
}: {
  content: string
  type: string
  shouldEnd: boolean
}) {
  if (shouldEnd) {
    spinner.succeed()
    spinner.stop()

    return
  }

  if (type && type !== spinnerType && spinnerType !== undefined) {
    spinner.succeed()

    spinner.prefixText = `[${type}]: `
    spinner.start()
  }

  spinner.text = content
  spinnerType = type
}

async function ask(conversationId: string) {
  const question = await prompts({ message: "Whats up?", type: "text", name: "prompt" })
  spinner.start()
  await magic(
    {
      conversationId,
      prompt: question.prompt
    },
    cb
  )

  spinner.stop()
  await ask(conversationId)
}

async function main() {
  const conversationId = crypto.randomUUID()
  await ask(conversationId)
}

main()
