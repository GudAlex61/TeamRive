// @/components/BookingScroller.tsx
"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

export default function BookingScroller(): null {
  const searchParams = useSearchParams()
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (searchParams?.get("scrollTo") !== "booking") return

      // собирать таймеры для cleanup
      timersRef.current = []

      const clearInlineOverflows = () => {
        try {
          // убираем только inline стили, не трогаем классы
          document.documentElement.style.overflow = ""
          document.body.style.overflow = ""
          // по горизонтали оставим скрытие
          document.documentElement.style.overflowX = "hidden"
          document.body.style.overflowX = "hidden"
        } catch {}
      }

      clearInlineOverflows()

      let attempts = 0
      const maxAttempts = 15
      const intervalMs = 150
      let done = false

      const smoothScrollToEl = (el: HTMLElement) => {
        try {
          // временно включим плавную прокрутку у documentElement (вдруг переопределено)
          const prev = document.documentElement.style.scrollBehavior
          document.documentElement.style.scrollBehavior = "smooth"
          // вычислим абсолютную позицию и промотаем
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          window.scrollTo({ top, behavior: "smooth" })
          // restore scrollBehavior через небольшую задержку
          const restore = window.setTimeout(() => {
            try { document.documentElement.style.scrollBehavior = prev || "" } catch {}
          }, 700)
          timersRef.current.push(restore)
        } catch {}
      }

      const tryScroll = () => {
        if (done) return
        attempts++
        const el = document.getElementById("booking-form")
        if (el) {
          // убедимся, что не осталось inline hidden overflow
          clearInlineOverflows()
          smoothScrollToEl(el)
          try { history.replaceState(null, "", window.location.pathname + window.location.hash) } catch {}
          // tidy: через 600ms снять возможные временные стили
          const tidy = window.setTimeout(() => {
            try {
              document.documentElement.style.overflowY = ""
              document.body.style.overflowY = ""
              document.documentElement.style.overflow = ""
              document.body.style.overflow = ""
              document.documentElement.style.overflowX = "hidden"
              document.body.style.overflowX = "hidden"
            } catch {}
          }, 650)
          timersRef.current.push(tidy)
          done = true
          return
        }
        if (attempts < maxAttempts) {
          const t = window.setTimeout(tryScroll, intervalMs)
          timersRef.current.push(t)
        } else {
          // fallback: установим хэш (рабочий вариант для браузеров)
          const t = window.setTimeout(() => {
            const fallbackEl = document.getElementById("booking-form")
            if (fallbackEl) smoothScrollToEl(fallbackEl)
            else window.location.hash = "#booking-form"
            try { history.replaceState(null, "", window.location.pathname + window.location.hash) } catch {}
          }, 200)
          timersRef.current.push(t)
        }
      }

      const start = window.setTimeout(tryScroll, 200)
      timersRef.current.push(start)

      return () => {
        timersRef.current.forEach((id) => clearTimeout(id))
        timersRef.current = []
        try {
          document.documentElement.style.overflow = ""
          document.body.style.overflow = ""
          document.documentElement.style.overflowX = ""
          document.body.style.overflowX = ""
        } catch {}
      }
    } catch (e) {
      // silently ignore
    }
  }, [searchParams?.toString()])

  return null
}
