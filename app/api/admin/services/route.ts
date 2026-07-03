import { NextRequest, NextResponse } from "next/server"
import { getServices, saveServices } from "@/lib/kv/client"
import type { Service } from "@/lib/kv/client"

function verifyAdminSession(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session")
  return cookie?.value === "authenticated"
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const services = await getServices()
    return NextResponse.json(services)
  } catch (error) {
    console.log("[v0] Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Service[]
    await saveServices(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Error saving services:", error)
    return NextResponse.json({ error: "Failed to save services" }, { status: 500 })
  }
}
