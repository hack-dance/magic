import OpenAI from "openai"

export const oai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  organization: process.env["OPENAI_ORG_ID"]
})
