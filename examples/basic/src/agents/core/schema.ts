import z from "zod"

import { db } from "@/lib/db"

interface WikipediaSearchResult {
  batchcomplete: string
  continue?: {
    sroffset: number
    continue: string
  }
  query: {
    searchinfo: {
      totalhits: number
    }
    search: {
      ns: number
      title: string
      pageid: number
      size: number
      wordcount: number
      snippet: string
      timestamp: string
    }[]
  }
}
export const CORE_AGENT_ACTIONS = {
  UPDATE_USER_DATA: "UPDATE_USER_DATA",
  SEARCH_WIKIPEDIA: "SEARCH_WIKIPEDIA"
}

export const updateUserParams = z.object({
  action: z.literal(CORE_AGENT_ACTIONS.UPDATE_USER_DATA),
  data: z
    .object({
      name: z.string().optional(),
      email: z.string().optional()
    })
    .describe("new properties to add or update on the user record. ")
})

export const searchWikipediaParams = z.object({
  action: z.literal(CORE_AGENT_ACTIONS.SEARCH_WIKIPEDIA),
  query: z.string().describe("the query to use when fetching data from Wikipedia API")
})

export const actionParams = z
  .discriminatedUnion("action", [updateUserParams, searchWikipediaParams])
  .nullable()

export const coreAgentSchema = z.object({
  content: z.string().describe("Your response to the end users prompt."),
  action: z.enum([...Object.values(CORE_AGENT_ACTIONS)] as [string, ...string[]]).nullable(),
  actionParams
})

export type ActionParams = {
  [K in (typeof CORE_AGENT_ACTIONS)[keyof typeof CORE_AGENT_ACTIONS]]: K extends (
    typeof CORE_AGENT_ACTIONS.UPDATE_USER_DATA
  ) ?
    Omit<z.infer<typeof updateUserParams>, "action">
  : K extends typeof CORE_AGENT_ACTIONS.SEARCH_WIKIPEDIA ?
    Omit<z.infer<typeof searchWikipediaParams>, "action">
  : never
}

export type ActionHandler<T extends keyof typeof CORE_AGENT_ACTIONS> = (params: {
  userId: string
  data: Omit<ActionParams[T], "action">
}) => Promise<unknown>

export const actionDefinitions = {
  [CORE_AGENT_ACTIONS.UPDATE_USER_DATA]: {
    handler: async function ({
      data,
      userId
    }: {
      userId: string
      data: {
        data: z.infer<typeof updateUserParams>["data"]
      }
    }) {
      return await db.user.upsert({ id: userId, data: data.data })
    },
    description: "Persist any new information you can about the user to the database.",
    sideEffect: true,
    example: ``
  },
  [CORE_AGENT_ACTIONS.SEARCH_WIKIPEDIA]: {
    handler: async function ({
      data
    }: {
      data: {
        query: z.infer<typeof searchWikipediaParams>["query"]
      }
      userId: string
    }) {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(data.query)}&format=json`
      )
      return (await response.json()) as WikipediaSearchResult
    },
    sideEffect: false,
    description: "Fetch relevant information from Wikipedia API to help answer the users request.",
    example: `
      [user]: what can you tell me about the Eiffel Tower?
      // assistant response: 
      {
        content: "Let me fetch some information about the Eiffel Tower from Wikipedia.",
        action: "SEARCH_WIKIPEDIA",
        actionParams: {
          query: "Eiffel Tower"
        }
      }
      // ...system calls action handler...
      // action handler output: [{ title: "Eiffel Tower", snippet: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower." }]
      // assistant called again with action handler output
      // assistant response: 
      {
        content: "According to Wikipedia, the Eiffel Tower is a famous landmark in Paris, France. It is a wrought-iron lattice tower located on the Champ de Mars. The tower is named after Gustave Eiffel, the engineer whose company designed and built it. The Eiffel Tower is a well-known symbol of Paris and one of the most recognizable structures in the world."
      }
    `
  }
}
