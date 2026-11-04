import { streamText, tool } from "ai"
import { z } from "zod"
import { requireMerchant } from "@/lib/auth"
import { searchMerchantCatalog } from "@/lib/typesense"

export async function POST(request: Request) {
  const merchant = await requireMerchant(request)
  const { messages } = await request.json()

  const result = streamText({
    model: "openai/gpt-4o",
    messages,
    maxOutputTokens: 700,
    tools: {
      searchCatalog: tool({
        description: "Search this merchant's catalog using Typesense.",
        inputSchema: z.object({ query: z.string(), limit: z.number().int().min(1).max(12).default(6) }),
        execute: async ({ query, limit }) => {
          const products = await searchMerchantCatalog(merchant.merchantId, query, limit)
          return { query, products, limit }
        },
      }),
    },
    system: "You are a concise shopping assistant. Use searchCatalog for product questions. Never invent products or prices. Mention stock when relevant.",
  })

  return result.toUIMessageStreamResponse()
}
