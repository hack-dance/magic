import { coreAgent } from "@/agents/core"
import {
  actionDefinitions,
  ActionHandler,
  ActionParams,
  CORE_AGENT_ACTIONS,
  coreAgentSchema
} from "@/agents/core/schema"
import OpenAI from "openai"
import { z } from "zod"

import { db, Message } from "@/lib/db"

import { logger } from "./lib/logger"

type RagResult = {
  id: string
  score: number
  payload: {
    content: string
  }
}

type MagicFlowInputParams = {
  prompt: string
  conversationId: string
}

let clientCB: ({
  content,
  type
}: {
  content: string
  type: string
  shouldEnd: boolean
}) => void = () => {}
export function publishToClientStream(content: string, type: string, shouldEnd: boolean) {
  logger.debug({
    message: content,
    content
  })

  clientCB({ content, type, shouldEnd })
}

export async function queryVectorDb(query: string): Promise<RagResult[]> {
  logger.debug({
    message: "Querying Vector DB",
    query
  })

  return [{ id: "1", score: 0.85, payload: { content: "Vector DB result 1" } }]
}

function resolveContextToUse({
  conversationMessages,
  ragResults
}: {
  conversationMessages: Message[]
  ragResults: RagResult[]
}): OpenAI.ChatCompletionMessageParam[] {
  logger.debug({
    message: "Resolving what context to use",
    conversationMessages,
    ragResults
  })

  return [
    ...conversationMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: "system",
      content: `here are the results of the semantic search query: ${JSON.stringify(ragResults)}`
    }
  ]
}

async function getContextMessages({ prompt, conversationId }: MagicFlowInputParams) {
  logger.debug({
    message: "Getting context messages",
    prompt,
    conversationId
  })

  const conversationMessages = await db.message.getMany({
    where: {
      conversationRef: conversationId
    }
  })

  const ragResults = await queryVectorDb(prompt)

  const ctxMessages = resolveContextToUse({
    conversationMessages,
    ragResults
  })

  return [...ctxMessages, { role: "user", content: prompt }] as OpenAI.ChatCompletionMessageParam[]
}

async function coreAgentCall({
  messages
}: {
  messages: OpenAI.ChatCompletionMessageParam[]
  isFollowUp?: boolean
}) {
  logger.debug({
    message: "Calling core agent",
    messages
  })

  const completionStream = await coreAgent.completionStream({ messages: messages })

  let final = {}

  for await (const partial of completionStream) {
    publishToClientStream(partial.content ?? "", "assistant", false)
    final = partial
  }

  logger.debug({
    message: "Core agent call complete",
    final
  })

  const complete = final as z.infer<typeof coreAgentSchema>

  return complete
}

async function handleActions({ completion }: { completion: z.infer<typeof coreAgentSchema> }) {
  const action = completion.action as keyof typeof CORE_AGENT_ACTIONS
  const actionParams = completion.actionParams as ActionParams[typeof action]

  if (!action) {
    publishToClientStream("no action to execute." ?? "", "actions", false)
    logger.debug({
      message: "No action to call.."
    })

    return
  }

  logger.debug({
    message: `Calling action ${action}}`,
    actionParams
  })

  publishToClientStream(`Calling action ${action}` ?? "", "actions", false)

  const actionDefinition = actionDefinitions[action]
  const handler = actionDefinition.handler as ActionHandler<typeof action>

  const result = await handler({
    ...actionParams,
    userId: "abc123"
  })

  logger.debug({
    message: `Action ${action} complete`,
    result
  })

  if (actionDefinition.sideEffect) {
    return
  }

  return `The result of the ${action} call is: ${JSON.stringify(result)}`
}

export async function magic(inputParams: MagicFlowInputParams, cb: typeof clientCB) {
  clientCB = cb

  logger.debug({
    message: "The magic is starting...",
    inputParams
  })

  const messages = await getContextMessages(inputParams)
  const agentResponse = await coreAgentCall({ messages })
  const actionResult = await handleActions({ completion: agentResponse })

  if (actionResult) {
    logger.debug({
      message: "Calling core agent with follow up from action"
    })

    publishToClientStream(`Sending action results back to core agent.` ?? "", "follow-up", false)

    await coreAgentCall({
      isFollowUp: true,
      messages: [
        ...messages,
        { role: "assistant", content: agentResponse.content },
        { role: "system", content: actionResult }
      ]
    })
  }

  publishToClientStream(`The magic is complete` ?? "", "complete", true)

  logger.debug({
    message: "The magic is complete!"
  })
}
