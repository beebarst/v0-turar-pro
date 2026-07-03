import { NextRequest, NextResponse } from "next/server"
import { getSettings, saveSettings } from "@/lib/kv/client"
import type { Settings } from "@/lib/kv/client"

function verifyAdminSession(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_session")
  return cookie?.value === "authenticated"
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.log("[v0] Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Settings
    await saveSettings(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
