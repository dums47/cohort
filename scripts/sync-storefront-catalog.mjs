#!/usr/bin/env node

import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import http from "node:http"
import https from "node:https"
import { pathToFileURL } from "node:url"

const maxSitemaps = 25
const maxProducts = 10_000
const batchSize = 100
const requestTimeoutMs = 15_000
const maxResponseBytes = 5 * 1024 * 1024
const maxRedirects = 5

function usage() {
  console.log(`Usage: node scripts/sync-storefront-catalog.mjs <storefront-url>

Environment:
  SHOPMATE_API_URL  Base URL for the ShopMate API (for example https://api.shopmate.ai)
  SHOPMATE_API_KEY  Merchant publishable key (pk_live_...)

The storefront must expose product pages in its XML sitemap and publish Product
JSON-LD on those pages. Products are sent to POST /api/v1/products/sync.
Local storefronts (localhost/127.0.0.1) are supported when you run this script
on the same computer, for example:
  node scripts/sync-storefront-catalog.mjs http://localhost:3000`)
}

function normalizeUrl(value, base) {
  try {
    const url = new URL(value, base)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    url.hash = ""
    return url
  } catch {
    return null
  }
}

function xmlDecode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
}

function isLocalhostName(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "")
  if (host === "localhost" || host === "::1") return true
  if (isIP(host) !== 4) return false
  return Number(host.split(".")[0]) === 127
}

function isLoopbackAddress(address) {
  const host = address.toLowerCase().replace(/^\[|\]$/g, "")
  if (host === "::1") return true
  return isIP(host) === 4 && Number(host.split(".")[0]) === 127
}

async function fetchText(url, { allowLocalhost = false } = {}) {
  const parsedUrl = new URL(url)
  const localTarget = isLocalhostName(parsedUrl.hostname)
  if (parsedUrl.username || parsedUrl.password ||
      (localTarget && !allowLocalhost) ||
      (!localTarget && (parsedUrl.protocol !== "https:" || (parsedUrl.port && parsedUrl.port !== "443") || isIP(parsedUrl.hostname) !== 0)) ||
      (localTarget && parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")) {
    throw new Error("Only public HTTPS storefront URLs are supported.")
  }

  const requestUrl = async (target, redirectsLeft) => new Promise((resolve, reject) => {
    const transport = target.protocol === "https:" ? https : http
    const request = transport.get(target, {
      headers: { "User-Agent": "ShopMateCatalogSync/1.0" },
      lookup(hostname, options, callback) {
        lookup(hostname, { all: true, verbatim: true })
          .then((addresses) => {
            const addressIsAllowed = localTarget ? isLoopbackAddress : isPublicAddress
            if (!addresses.length || addresses.some(({ address }) => !addressIsAllowed(address))) {
              callback(new Error(localTarget
                ? "Local storefront must resolve only to loopback addresses."
                : "Storefront resolves to a non-public IP address."))
              return
            }
            if (options && typeof options === "object" && "all" in options && options.all) {
              callback(null, addresses)
            } else {
              callback(null, addresses[0].address, addresses[0].family)
            }
          })
          .catch((error) => callback(error))
      },
    }, (response) => {
      const location = response.headers.location
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && location) {
        response.resume()
        if (redirectsLeft === 0) {
          reject(new Error("Storefront returned too many redirects."))
          return
        }
        const redirectedUrl = normalizeUrl(location, target)
        if (!redirectedUrl || redirectedUrl.origin !== parsedUrl.origin) {
          reject(new Error("Storefront redirected to a different or unsupported host."))
          return
        }
        requestUrl(redirectedUrl, redirectsLeft - 1).then(resolve, reject)
        return
      }

      if (response.statusCode !== 200) {
        response.resume()
        reject(new Error(`GET ${target} returned HTTP ${response.statusCode ?? "unknown"}`))
        return
      }

      const chunks = []
      let totalBytes = 0
      response.on("data", (chunk) => {
        totalBytes += chunk.length
        if (totalBytes > maxResponseBytes) {
          request.destroy(new Error(`GET ${target} exceeded the ${maxResponseBytes} byte response limit.`))
          return
        }
        chunks.push(chunk)
      })
      response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
      response.on("error", reject)
    })
    request.setTimeout(requestTimeoutMs, () => request.destroy(new Error(`GET ${target} timed out.`)))
    request.on("error", reject)
  })

  return requestUrl(parsedUrl, maxRedirects)
}

function isPublicAddress(address) {
  const family = isIP(address)
  if (family === 4) {
    const octets = address.split(".").map(Number)
    const [a, b, c] = octets
    return !(
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 0 || b === 168)) ||
      (a === 192 && b === 88 && c === 99) ||
      (a === 198 && (b === 18 || b === 19 || b === 51)) ||
      (a === 203 && b === 0 && c === 113)
    )
  }
  if (family !== 6) return false

  const normalized = address.toLowerCase()
  const firstGroup = Number.parseInt(normalized.split(":")[0] || "0", 16)
  return (firstGroup & 0xe000) === 0x2000 &&
    !normalized.startsWith("2001:db8:") &&
    !normalized.startsWith("2001:0000:") &&
    !normalized.startsWith("2001:0:")
}

async function findSitemapUrls(siteUrl, options) {
  const sitemapUrls = new Set()
  try {
    const robots = await fetchText(new URL("/robots.txt", siteUrl).href, options)
    for (const line of robots.split(/\r?\n/)) {
      const match = line.match(/^\s*Sitemap:\s*(\S+)/i)
      if (match) {
        const url = normalizeUrl(match[1], siteUrl)
        if (url?.origin === siteUrl.origin) sitemapUrls.add(url.href)
      }
    }
  } catch (error) {
    console.warn(`Could not read robots.txt: ${error.message}`)
  }

  if (sitemapUrls.size === 0) {
    sitemapUrls.add(new URL("/sitemap.xml", siteUrl).href)
  }

  const pending = [...sitemapUrls]
  const visitedSitemaps = new Set()
  const pageUrls = new Set()
  while (pending.length > 0 && visitedSitemaps.size < maxSitemaps && pageUrls.size < maxProducts) {
    const sitemapUrl = pending.shift()
    if (visitedSitemaps.has(sitemapUrl)) continue
    visitedSitemaps.add(sitemapUrl)

    let xml
    try {
      xml = await fetchText(sitemapUrl, options)
    } catch (error) {
      console.warn(`Skipping sitemap ${sitemapUrl}: ${error.message}`)
      continue
    }

    const locations = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
      .map((match) => normalizeUrl(xmlDecode(match[1].trim()), siteUrl))
      .filter((location) => location?.origin === siteUrl.origin)

    if (/<sitemapindex\b/i.test(xml)) {
      for (const location of locations) {
        if (visitedSitemaps.size + pending.length >= maxSitemaps) break
        pending.push(location.href)
      }
    } else {
      for (const location of locations) {
        if (location.origin === siteUrl.origin) pageUrls.add(location.href)
        if (pageUrls.size >= maxProducts) break
      }
    }
  }

  if (pending.length > 0) console.warn(`Sitemap discovery stopped after ${maxSitemaps} sitemaps.`)
  if (pageUrls.size >= maxProducts) console.warn(`Product page discovery capped at ${maxProducts}.`)
  return [...pageUrls]
}

function isProductType(value) {
  const types = Array.isArray(value) ? value : [value]
  return types.some((type) => typeof type === "string" && /(?:^|\/)Product$/i.test(type))
}

function visitJsonLd(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) visitJsonLd(item, visit)
  } else if (value && typeof value === "object") {
    visit(value)
    for (const [key, child] of Object.entries(value)) {
      if (key !== "@context") visitJsonLd(child, visit)
    }
  }
}

function text(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : ""
}

function number(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value !== "string") return null
  const parsed = Number(value.replace(/[^0-9.-]/g, ""))
  return Number.isFinite(parsed) ? parsed : null
}

export function extractProducts(html, pageUrl) {
  const products = []
  const scripts = html.matchAll(/<script\b(?=[^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script\s*>/gi)
  for (const match of scripts) {
    try {
      const data = JSON.parse(match[1].trim())
      visitJsonLd(data, (item) => {
        if (!isProductType(item["@type"])) return

        const offerValue = item.offers
        const offer = Array.isArray(offerValue) ? offerValue[0] : offerValue
        const price = number(item.price ?? offer?.price ?? offer?.lowPrice)
        const title = text(item.name)
        if (!title || price === null || price < 0) return

        const rawImage = Array.isArray(item.image) ? item.image[0] : item.image
        const image = typeof rawImage === "object" && rawImage ? rawImage.url : rawImage
        const availability = text(offer?.availability)
        const inventory = number(offer?.inventoryLevel?.value)
        const stock = inventory !== null
          ? Math.max(0, Math.floor(inventory))
          : /OutOfStock|SoldOut/i.test(availability) ? 0
            : /InStock|LimitedAvailability/i.test(availability) ? 1 : 0
        const productUrl = normalizeUrl(text(item.url) || pageUrl, pageUrl)

        products.push({
          title,
          price,
          description: text(item.description),
          ...(image ? { image_url: normalizeUrl(text(image), pageUrl)?.href ?? text(image) } : {}),
          ...(productUrl ? { url: productUrl.href } : {}),
          ...(text(item.sku) ? { sku: text(item.sku) } : {}),
          stock,
        })
      })
    } catch (error) {
      console.warn(`Ignoring invalid Product JSON-LD on ${pageUrl}: ${error.message}`)
    }
  }
  return products
}

export async function discoverCatalogProducts(siteArgument, { allowLocalhost = false } = {}) {
  const siteUrl = normalizeUrl(siteArgument ?? "", "https://invalid.local")
  const localTarget = siteUrl && isLocalhostName(siteUrl.hostname)
  if (!siteArgument || !siteUrl || siteUrl.hostname === "invalid.local" ||
      (localTarget
        ? !allowLocalhost || (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:")
        : siteUrl.protocol !== "https:" || (siteUrl.port && siteUrl.port !== "443") || isIP(siteUrl.hostname) !== 0) ||
      siteUrl.username || siteUrl.password) {
    throw new Error("Provide a public storefront URL using HTTPS and a domain name.")
  }
  const options = { allowLocalhost }
  const pageUrls = await findSitemapUrls(siteUrl, options)
  if (pageUrls.length === 0) {
    throw new Error(`No storefront pages found in the sitemap for ${siteUrl.origin}.`)
  }

  const productsByIdentity = new Map()
  let pageErrors = 0
  for (let index = 0; index < pageUrls.length; index += 1) {
    const pageUrl = pageUrls[index]
    try {
      const html = await fetchText(pageUrl, options)
      for (const product of extractProducts(html, pageUrl)) {
        const identity = product.sku || product.url || `${product.title}\n${product.price}\n${product.image_url ?? ""}`
        productsByIdentity.set(identity, product)
      }
    } catch (error) {
      pageErrors += 1
      console.warn(`Skipping page ${pageUrl}: ${error.message}`)
    }
    if ((index + 1) % 25 === 0) {
      console.log(`Scanned ${index + 1}/${pageUrls.length} sitemap pages...`)
    }
  }

  const products = [...productsByIdentity.values()]
  if (products.length === 0) {
    throw new Error("No Product JSON-LD was found on the sitemap pages. This site may need a platform-specific connector.")
  }

  return { products, pagesScanned: pageUrls.length, pageErrors }
}

async function main() {
  const siteArgument = process.argv[2]
  if (siteArgument === "--help" || siteArgument === "-h") {
    usage()
    return
  }

  const apiUrl = normalizeUrl(process.env.SHOPMATE_API_URL ?? "", "https://invalid.local")
  const apiKey = process.env.SHOPMATE_API_KEY
  if (!apiUrl || apiUrl.hostname === "invalid.local") throw new Error("Set SHOPMATE_API_URL.")
  if (!apiKey?.startsWith("pk_live_")) throw new Error("Set SHOPMATE_API_KEY to the merchant publishable key.")

  const { products, pagesScanned, pageErrors } = await discoverCatalogProducts(siteArgument, { allowLocalhost: true })
  const endpoint = new URL("/api/v1/products/sync", apiUrl)
  for (let offset = 0; offset < products.length; offset += batchSize) {
    const batch = products.slice(offset, offset + batchSize)
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: batch }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    })
    const responseBody = await response.text()
    if (!response.ok) {
      throw new Error(`Catalog sync failed (${response.status}): ${responseBody}`)
    }
    console.log(`Synced batch ${Math.floor(offset / batchSize) + 1}: ${batch.length} products.`)
  }

  console.log(`Finished: synced ${products.length} unique products from ${pagesScanned} sitemap pages.`)
  if (pageErrors > 0) console.warn(`${pageErrors} sitemap pages could not be fetched.`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
