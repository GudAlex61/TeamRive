// app/components/BookingScroller.tsx
"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function BookingScroller() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (searchParams?.get("scrollTo") === "booking") {
        let fallbackTimer: number | null = null

        const mainTimer = window.setTimeout(() => {
          const bookingSection = document.getElementById("booking-form")

          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: "smooth", block: "start" })
            try { history.replaceState(null, "", window.location.pathname + window.location.hash) } catch {}
          } else {
            // если элемент ещё не в DOM — пробуем ещё раз через 500ms
            fallbackTimer = window.setTimeout(() => {
              const bs = document.getElementById("booking-form")
              bs?.scrollIntoView({ behavior: "smooth", block: "start" })
              try { history.replaceState(null, "", window.location.pathname + window.location.hash) } catch {}
            }, 500)
          }
        }, 300)

        return () => {
          clearTimeout(mainTimer)
          if (fallbackTimer) clearTimeout(fallbackTimer)
        }
      }
    } catch (e) {
      // silently ignore
    }
  }, [searchParams?.toString()])

  return null
}
