import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const token = process.env.TG_BOT_TOKEN
  const chatId = process.env.TG_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ error: "Telegram not configured" }, { status: 500 })
  }

  let body: { text?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { text } = body
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 })
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const tgRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })

  if (!tgRes.ok) {
    const err = await tgRes.text()
    return NextResponse.json({ error: "TG send failed", detail: err }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
