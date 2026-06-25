// Helpers for firing Meta Pixel events from anywhere in the client app.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/** Fire a standard Meta Pixel event (e.g. "Lead", "Contact"). */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params)
  }
}

/** Convenience wrapper for the "Lead" conversion event. */
export function trackLead(params?: Record<string, unknown>) {
  trackPixel("Lead", params)
}
