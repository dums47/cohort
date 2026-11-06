import { streamText, tool } from "ai"
import { z } from "zod"
import { NextResponse } from "next/server"
import { requireMerchant } from "@/lib/auth"
import { searchMerchantCatalog } from "@/lib/typesense"

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    },
  })
}

export async function POST(request: Request) {
  try {
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

    const response = result.toUIMessageStreamResponse()
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key")
    
    return response
  } catch (error: any) {
    // This will return the exact internal error text directly in your browser console/network tab
    console.error("CHAT API CRASH:", error)

    return NextResponse.json(
      { error: error?.message || String(error) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
        },
      }
    )
  }
}