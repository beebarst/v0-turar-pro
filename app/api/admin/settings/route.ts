import { NextRequest, NextResponse } from "next/server"
import { getStoredSettings, setStoredSettings } from "@/lib/kv"
import type { StoredSettings } from "@/lib/kv"

function checkAuth(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const auth = req.headers.get("x-admin-password")
  return auth === password
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await getStoredSettings()
  return NextResponse.json(data ?? {})
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json() as StoredSettings
    if (typeof body.discountPercent !== "number") {
      return NextResponse.json({ error: "discountPercent must be a number" }, { status: 400 })
    }
    await setStoredSettings(body)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
