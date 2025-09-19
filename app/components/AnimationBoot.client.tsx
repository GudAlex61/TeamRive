// app/components/AnimationBoot.client.tsx
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function AnimationBoot() {
  const pathname = usePathname()
  const moRef = useRef<MutationObserver | null>(null)
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true

    // Подождать появления window.AnimationSystem (poll, т.к. скрипт загружается через next/script)
    const waitForAnimationSystem = async (timeout = 3000) => {
      const start = Date.now()
      return new Promise<void>((resolve) => {
        const tick = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyWin: any = typeof window !== "undefined" ? window : null
          if (!anyWin) {
            if (Date.now() - start > timeout) return resolve()
            pollRef.current = window.setTimeout(tick, 100)
            return
          }
          if (anyWin.AnimationSystem && typeof anyWin.AnimationSystem.refresh === "function") {
            try { anyWin.AnimationSystem.refresh() } catch (e) {}
            return resolve()
          }
          // sometimes the script exposes methods later - keep polling
          if (Date.now() - start > timeout) return resolve()
          pollRef.current = window.setTimeout(tick, 100)
        }
        tick()
      })
    }

    // add aos-onload marks (for immediate onload animation)
    const markOnload = () => {
      try {
        document.querySelectorAll("[data-aos-onload]").forEach((el) => {
          if (!el.classList.contains("aos-animate")) el.classList.add("aos-animate")
        })
      } catch (e) {}
    }

    // Observe DOM changes and refresh animation system when nodes with data-aos appear
    const setupMutationObserver = () => {
      if (moRef.current) return
      try {
        moRef.current = new MutationObserver((mutations) => {
          let shouldRefresh = false
          for (const m of mutations) {
            // check added nodes quickly
            if (m.addedNodes && m.addedNodes.length) {
              for (const n of Array.from(m.addedNodes)) {
                try {
                  if ((n as Element).matches && (n as Element).matches("[data-aos], .stagger-animation")) {
                    shouldRefresh = true
                    break
                  }
                  // or contains a matching descendant
                  if ((n as Element).querySelector && (n as Element).querySelector("[data-aos], .stagger-animation")) {
                    shouldRefresh = true
                    break
                  }
                } catch (e) { /* ignore cross-origin nodes */ }
              }
            }
            if (shouldRefresh) break
          }
          if (shouldRefresh) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyWin: any = window
            if (anyWin && anyWin.AnimationSystem && typeof anyWin.AnimationSystem.refresh === "function") {
              try { anyWin.AnimationSystem.refresh() } catch (e) {}
            }
          }
        })
        moRef.current.observe(document.body, { childList: true, subtree: true })
      } catch (e) {
        // if document.body not ready or observer fails, ignore
      }
    }

    // On navigation/popstate we want to refresh animations and mark onload ones
    const handleNavigationUpdate = async () => {
      await waitForAnimationSystem(2500)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyWin: any = window
      if (anyWin && anyWin.AnimationSystem && typeof anyWin.AnimationSystem.refresh === "function") {
        try { anyWin.AnimationSystem.refresh() } catch (e) {}
      }
      markOnload()
    }

    // initial boot
    ;(async () => {
      await waitForAnimationSystem(3000)
      if (!mounted) return
      markOnload()
      setupMutationObserver()
      // best-effort refresh if available
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyWin: any = window
        if (anyWin && anyWin.AnimationSystem && typeof anyWin.AnimationSystem.refresh === "function") {
          anyWin.AnimationSystem.refresh()
        }
      } catch (e) {}
    })()

    // run on pathname changes (client navigation)
    handleNavigationUpdate()

    // also refresh on visibility change (back/forward may trigger)
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        handleNavigationUpdate()
      }
    }
    window.addEventListener("visibilitychange", onVisibility, { passive: true })

    return () => {
      mounted = false
      window.removeEventListener("visibilitychange", onVisibility)
      if (pollRef.current) {
        clearTimeout(pollRef.current)
        pollRef.current = null
      }
      if (moRef.current) {
        try { moRef.current.disconnect() } catch (e) {}
        moRef.current = null
      }
    }
  }, [pathname])

  return null
}
