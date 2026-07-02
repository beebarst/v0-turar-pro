import { NextRequest, NextResponse } from "next/server"
import { getPortfolioItems, savePortfolioItems } from "@/lib/kv/client"
import type { PortfolioItem } from "@/lib/kv/client"

function verifyAdminSession(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session")
  return cookie?.value === "authenticated"
}

export async function GET(request: NextRequest) {
  try {
    const items = await getPortfolioItems()
    return NextResponse.json(items)
  } catch (error) {
    console.log("[v0] Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as PortfolioItem[]
    await savePortfolioItems(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Error saving portfolio:", error)
    return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 })
  }
}
