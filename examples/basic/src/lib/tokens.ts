import { getEncoding } from "js-tiktoken"

export const countTokens = (message: string) => {
  const encoding = getEncoding("cl100k_base")
  const tokens = encoding.encode(message)

  return tokens?.length
}
