import Instructor from "@instructor-ai/instructor"
import OpenAI from "openai"
import { z } from "zod"

import { oai } from "@/lib/oai"

export type CreateAgentParams = {
  config: Partial<OpenAI.ChatCompletionCreateParams> & {
    model: OpenAI.ChatCompletionCreateParams["model"]
    messages: OpenAI.ChatCompletionMessageParam[]
  }
  response_model: {
    schema: z.AnyZodObject
    name: string
  }
}

export type AgentInstance = ReturnType<typeof createAgent>
export type ConfigOverride = Partial<OpenAI.ChatCompletionCreateParams>

const client = Instructor({
  client: oai,
  mode: "TOOLS"
})

/**
 * Create a pre-configured "agent" that can be used to generate completions
 * Messages that are passed at initialization will be pre-pended to all completions
 * all other configuration can be overriden in the completion call.
 *
 * @param {CreateAgentParams} params
 *
 * @returns {AgentInstance}
 */
export function createAgent<S extends z.AnyZodObject>({
  config,
  response_model
}: {
  config: Partial<OpenAI.ChatCompletionCreateParams> & {
    model: OpenAI.ChatCompletionCreateParams["model"]
    messages: OpenAI.ChatCompletionMessageParam[]
  }
  response_model: {
    schema: S
    name: string
  }
}) {
  const defaultAgentParams = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    ...config
  }

  return {
    /**
     * Generate a single stream completion
     * @param {ConfigOverride}
     *
     * @returns {Promise<AsyncGenerator<z.infer<typeof response_model.schema>>> }
     */
    completionStream: async (configOverride: ConfigOverride) => {
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride?.messages ?? [])
      ] as OpenAI.ChatCompletionMessageParam[]

      const extractionStream = await client.chat.completions.create({
        ...defaultAgentParams,
        ...configOverride,
        response_model,
        stream: true,
        messages
      })

      return extractionStream
    },
    completion: async (configOverride: ConfigOverride) => {
      const messages = [
        ...(defaultAgentParams.messages ?? []),
        ...(configOverride?.messages ?? [])
      ] as OpenAI.ChatCompletionMessageParam[]

      const client = Instructor({
        client: oai,
        mode: "TOOLS"
      })

      const extraction = await client.chat.completions.create({
        ...defaultAgentParams,
        ...configOverride,
        response_model,
        stream: false,
        messages
      })

      return extraction
    }
  }
}
