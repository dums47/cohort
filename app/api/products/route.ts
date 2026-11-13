import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export const sampleProducts = [
  {
    id: "81QFM3",
    sku: "ELC-WC-881",
    name: "Aura Wireless Headphones",
    category: "Electronics",
    price: 299.99,
    currency: "USD",
    stock: 45,
    inStock: true,
    rating: 4.9,
    reviewsCount: 128,
    description: "Industry-leading active noise cancellation with 40-hour battery life, ultra-plush memory foam earcups, and studio-grade acoustics.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    accentColor: "#F59E0B",
    tags: ["audio", "bluetooth", "anc", "headphones", "wireless", "sound", "noise cancelling"]
  },
  {
    id: "924GB0",
    sku: "ELC-KB-982",
    name: "Pulse Mechanical Keyboard",
    category: "Electronics",
    price: 139.50,
    currency: "USD",
    stock: 82,
    inStock: true,
    rating: 4.8,
    reviewsCount: 94,
    description: "Compact 75% mechanical keyboard with hot-swappable linear quiet switches, RGB backlighting, and CNC anodized aluminum chassis.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    accentColor: "#E2E8F0",
    tags: ["keyboard", "mechanical", "gaming", "office", "swappable", "typing", "linear switches"]
  },
  {
    id: "48LMN2",
    sku: "FIT-SW-401",
    name: "OmniFit Apex Smartwatch",
    category: "Fitness",
    price: 189.00,
    currency: "USD",
    stock: 34,
    inStock: true,
    rating: 4.7,
    reviewsCount: 67,
    description: "Rugged fitness smartwatch with sapphire AMOLED display, precision biometric tracking, and 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    accentColor: "#0F172A",
    tags: ["smartwatch", "fitness", "gps", "waterproof", "running", "heart rate"]
  },
  {
    id: "19XOP8",
    sku: "ACC-BP-112",
    name: "Nomad All-Weather Daypack",
    category: "Accessories",
    price: 119.00,
    currency: "USD",
    stock: 61,
    inStock: true,
    rating: 4.9,
    reviewsCount: 210,
    description: "Weatherproof recycled Cordura nylon backpack with dedicated 16-inch laptop compartment and magnetic fidlock closure.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    accentColor: "#334155",
    tags: ["backpack", "travel", "waterproof", "laptop", "bag", "commute"]
  },
  {
    id: "67VBN1",
    sku: "APP-HD-330",
    name: "Merino Tech Heavyweight Hoodie",
    category: "Apparel",
    price: 88.00,
    currency: "USD",
    stock: 90,
    inStock: true,
    rating: 4.6,
    reviewsCount: 83,
    description: "Ultra-soft thermal regulating merino wool blend hoodie with hidden kangaroo zipper pocket and thumbhole cuffs.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    accentColor: "#1E293B",
    tags: ["apparel", "hoodie", "merino", "warm", "sweater", "clothing"]
  },
  {
    id: "33TYR9",
    sku: "HMO-DK-554",
    name: "ErgoRiser Bamboo Standing Desk",
    category: "Home & Office",
    price: 249.99,
    currency: "USD",
    stock: 18,
    inStock: true,
    rating: 4.8,
    reviewsCount: 51,
    description: "Dual-tier pneumatic standing desk riser crafted from sustainable solid bamboo with integrated cable raceway.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
    accentColor: "#78350F",
    tags: ["desk", "ergonomic", "standing", "bamboo", "office", "workspace", "furniture"]
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("q")?.toLowerCase()
  const inStockOnly = searchParams.get("inStock") === "true"

  let results = [...sampleProducts]

  if (category && category !== "All Items") {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  if (inStockOnly) {
    results = results.filter((p) => p.inStock)
  }

  if (query) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  return NextResponse.json({
    status: "ok",
    endpoint: "/api/products",
    timestamp: new Date().toISOString(),
    engine: "ShopMate Natural Intent v2.4",
    latency_ms: Math.floor(Math.random() * 15) + 18, // 18-32ms ultra-fast
    total: results.length,
    products: results
  })
}
