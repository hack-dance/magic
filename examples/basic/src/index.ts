import { coreAgent } from "@/agents/core"
import {
  actionDefinitions,
  ActionHandler,
  ActionParams,
  CORE_AGENT_ACTIONS,
  coreAgentSchema
} from "@/agents/core/schema"
import { type Logger } from "@common/logger/types"
import OpenAI from "openai"
import { z } from "zod"

import { db as dbInstance, Message } from "@/lib/db"

type RagResult = {
  id: string
  score: number
  payload: {
    content: string
  }
}

type MagicFlowInputParams<T extends Logger> = {
  prompt: string
  logger: T
}

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function main<T extends Logger>(
  inputParams: MagicFlowInputParams<T> & {
    userId: string
    conversationId: string
  },
  db: typeof dbInstance
) {
  const logger = inputParams.logger

  async function queryVectorDb(_query: string): Promise<RagResult[]> {
    await pause(250)

    return [{ id: "1", score: 0.85, payload: { content: "Vector DB result 1" } }]
  }

  function resolveContextToUse({
    conversationMessages,
    ragResults
  }: {
    conversationMessages: Message[]
    ragResults: RagResult[]
  }): OpenAI.ChatCompletionMessageParam[] {
    logger.log({
      group: "context",
      log: "Resolving context to use",
      type: "info"
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

  async function getContextMessages({
    prompt,
    conversationId
  }: {
    prompt: string
    conversationId: string
  }) {
    logger.log({
      group: "context",
      log: "Getting context for initial call...",
      type: "start"
    })

    logger.log({
      group: "context",
      log: "Fetching conversation messages...",
      type: "info"
    })
    const conversationMessages = await db.message.getMany({
      where: {
        conversationRef: conversationId
      }
    })

    logger.log({
      group: "context",
      log: "Fetching semantic search results...",
      step: `Retrieved ${conversationMessages?.length} messages`,
      type: "info"
    })

    const ragResults = await queryVectorDb(prompt)

    logger.log({
      group: "context",
      log: "Resolving what context to use...",
      step: "Semantic search query returned 1 result",
      type: "info"
    })
    const ctxMessages = resolveContextToUse({
      conversationMessages,
      ragResults
    })

    logger.log({
      group: "context",
      log: "Context resolved!",
      type: "success"
    })
    return [
      ...ctxMessages,
      { role: "user", content: prompt }
    ] as OpenAI.ChatCompletionMessageParam[]
  }

  async function coreAgentCall({
    messages
  }: {
    messages: OpenAI.ChatCompletionMessageParam[]
    isFollowUp?: boolean
  }) {
    logger.log({
      group: "core-agent",
      log: "Starting core agent stream...",
      type: "start"
    })

    const completionStream = await coreAgent.completionStream({ messages: messages })

    let final: Partial<z.infer<typeof coreAgentSchema>> = {}

    for await (const partial of completionStream) {
      final = partial

      logger.log({
        group: "core-agent",
        stream: true,
        log: final.content ?? "",
        type: "info"
      })
    }

    const complete = final as z.infer<typeof coreAgentSchema>

    logger.log({
      group: "core-agent",
      log: complete.content ?? "",
      type: "success"
    })

    return complete
  }

  async function handleActions({ completion }: { completion: z.infer<typeof coreAgentSchema> }) {
    const action = completion.action as keyof typeof CORE_AGENT_ACTIONS
    const actionParams = completion.actionParams as ActionParams[typeof action]
    logger.log({
      group: "actions",
      log: "Handling actions...",
      step: "Check for actions.",
      type: "start"
    })

    if (!action) {
      logger.log({
        group: "actions",
        log: "No action to call...",
        type: "success"
      })

      return
    }

    logger.log({
      group: "actions",
      log: `Calling action ${action}...`,
      type: "info"
    })

    const actionDefinition = actionDefinitions[action]
    const handler = actionDefinition.handler as ActionHandler<typeof action>

    const result = await handler({
      data: actionParams,
      userId: inputParams.userId
    })

    logger.log({
      group: "actions",
      log: `Action handlers completed.`,
      step: `Action ${action} called successfully. \n result: ${JSON.stringify(result, null, 2)}`,
      type: "success"
    })

    if (actionDefinition.sideEffect) {
      return
    }

    return `The result of the ${action} call is: ${JSON.stringify(result)}`
  }

  logger.log({
    group: "magic",
    log: "This magic is about to begin...",
    type: "success"
  })

  await db.message.create({
    data: {
      conversationRef: inputParams.conversationId,
      content: inputParams.prompt,
      role: "user",
      userRef: inputParams.userId
    }
  })

  const messages = await getContextMessages(inputParams)
  const agentResponse = await coreAgentCall({ messages })
  const actionResult = await handleActions({ completion: agentResponse })

  if (actionResult) {
    logger.log({
      group: "magic",
      log: "The magic continues, with action results...",
      type: "success"
    })

    await coreAgentCall({
      isFollowUp: true,
      messages: [
        ...messages,
        { role: "assistant", content: agentResponse.content },
        { role: "system", content: actionResult }
      ]
    })
  }

  logger.log({
    group: "magic",
    log: "The magic is complete!",
    type: "success"
  })

  await pause(500)
}

export class Magic<T extends Logger> {
  private db: typeof dbInstance
  private conversationId: string | null
  private userId: string | null

  constructor() {
    this.db = dbInstance
    this.conversationId = null
    this.userId = null

    this.setup()
  }

  async setup() {
    const conversation = await this.db.conversation.create({
      data: {
        messageRefs: []
      }
    })

    const user = await this.db.user.create({
      data: {}
    })

    if (!conversation || !user) {
      throw new Error("Failed to initialize")
    }

    this.conversationId = conversation.id
    this.userId = user.id
  }

  async run(inputParams: MagicFlowInputParams<T>) {
    await main(
      {
        ...inputParams,
        userId: this.userId ?? "",
        conversationId: this.conversationId ?? ""
      },
      this.db
    )
  }
}
