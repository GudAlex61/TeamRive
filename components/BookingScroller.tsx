"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

/**
 * Клиентский компонент, отвечающий за прокрутку к #booking при ?scrollTo=booking
 * - Обязательно "use client" вверху.
 * - Использует useSearchParams только на клиенте.
 */
export default function BookingScroller(): null {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (searchParams?.get("scrollTo") === "booking") {
        let fallbackTimer: number | null = null

        // основной таймер — даём странице подгрузиться
        const mainTimer = window.setTimeout(() => {
          const bookingSection = document.getElementById("booking-form")
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: "smooth", block: "start" })
            try { history.replaceState(null, "", window.location.pathname + window.location.hash) } catch {}
          } else {
            // если элемента нет — делаем однократный fallback
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
      // безопасно молча игнорируем
    }
  }, [searchParams?.toString()])

  return null
}
