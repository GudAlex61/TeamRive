// app/volgograd/page.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Users, Dumbbell, Car, UtensilsCrossed, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VolgogradPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  // touch/swipe refs
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const prevBodyOverflow = useRef<string | null>(null)

  // AOS-like observer
  useEffect(() => {
    if (typeof window === "undefined") return
    const timeouts: number[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (!el) return
          if (entry.isIntersecting) {
            const rawDelay = el.getAttribute("data-aos-delay") || el.dataset.aosDelay || "0"
            const delay = parseInt(rawDelay.toString(), 10) || 0
            const doAnimate = () => {
              el.classList.add("aos-animate")
            }
            if (el.hasAttribute("data-aos-onload")) {
              const t = window.setTimeout(doAnimate, delay)
              timeouts.push(t)
            } else {
              const t = window.setTimeout(() => doAnimate(), delay)
              timeouts.push(t)
            }
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.12,
        root: null,
        rootMargin: "0px",
      }
    )

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"))
    nodes.forEach((n) => {
      if (n.classList.contains("aos-animate")) return
      observer.observe(n)
    })

    return () => {
      timeouts.forEach((t) => clearTimeout(t))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0)
  }, [])

  const images = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ]

  const nextImage = useCallback(() => setCurrentImageIndex((p) => (p + 1) % images.length), [images.length])
  const prevImage = useCallback(() => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length), [images.length])

  const openModalAt = (idx: number) => {
    setCurrentImageIndex(idx)
    // блокируем прокрутку корректно
    if (typeof document !== "undefined") {
      prevBodyOverflow.current = document.body.style.overflow
      document.body.style.overflow = "hidden"
    }
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    if (typeof document !== "undefined") {
      document.body.style.overflow = prevBodyOverflow.current ?? ""
      prevBodyOverflow.current = null
    }
  }

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal()
      else if (e.key === "ArrowRight") nextImage()
      else if (e.key === "ArrowLeft") prevImage()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modalOpen, nextImage, prevImage])

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const touch = e.changedTouches && e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - touchStartX.current
    const dy = touch.clientY - touchStartY.current
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    const THRESHOLD = 40
    if (absDx > THRESHOLD && absDx > absDy) {
      if (dx < 0) nextImage()
      else prevImage()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const onModalAreaClick = (e: React.MouseEvent) => {
    const x = e.clientX
    const vw = window.innerWidth
    if (x < vw / 2) prevImage()
    else nextImage()
  }

  const scrollToBooking = () => {
    // SPA navigation to trigger main page scroll handler
    router.push("/?scrollTo=booking")
  }

  // NOTE: We don't inject a global "*:hover { all: unset }" hack because it breaks touch interactivity (previous bug).
  // If you still want to disable hover styles on touch devices, we can add more targeted rules.

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" data-aos="fade" data-aos-onload>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">Team Rive</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4" data-aos="slide-up" data-aos-delay="100">
            <Link href="/" className="text-muted-foreground">Главная</Link>
            <span className="text-muted-foreground">/</span>
            <span>Волгоград</span>
          </div>

          <div className="flex items-center gap-3 mb-6" data-aos="slide-up" data-aos-delay="200">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Спортивная база — Волгоград</h1>
            <div className="ml-4">
              <Badge variant="secondary" className="text-base px-3 py-2">от 2150₽</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8" data-aos="slide-up" data-aos-delay="300">
            <Badge variant="secondary">Проживание в гостинице</Badge>
            <Badge variant="secondary">3-разовое питание</Badge>
            <Badge variant="secondary">Экскурсии и мемориалы</Badge>
            <Badge variant="secondary">Турниры на арене</Badge>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto" data-aos="zoom-in" data-aos-delay="400">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-2xl bg-black flex items-center justify-center">
              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`Волгоград - фото ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain cursor-zoom-in"
                onClick={() => openModalAt(currentImageIndex)}
                draggable={false}
              />

              {/* Desktop arrows */}
              <button
                onClick={prevImage}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-2" data-aos="slide-up" data-aos-delay="500">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${idx === currentImageIndex ? "border-primary shadow-lg" : "border-transparent"}`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description & Quick Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2" data-aos="fade-right" data-aos-delay="200">
              <h2 className="text-3xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">О базе — Волгоград</h2>
              <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  В пакет (от 2150₽) входит проживание в гостиницах «НОЙ» или «Волга-Волга», трёхразовое питание и курортный сбор. Для команд доступны комфортные номера и полный спектр сервисов.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Для участников предусмотрено посещение музея «Сталинградская битва» и Мемориала Мамаев Курган. Турниры и сборы проходят на стадионе «Волгоград-Арена» и в манежах.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Организуем трансфер, питание, медицинское сопровождение и тренировочные сессии под ключ.
                </p>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="400">
              <Card className="shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-white to-gray-50/50">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-lg pointer-events-none"></div>
                <CardContent className="relative p-6">
                  <h3 className="font-semibold mb-4 text-xl">Быстрая информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-base">Команды до 50 человек</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-base">Близко к ключевым спортобъектам</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-5 h-5 text-primary" />
                      <span className="text-base">Тренажёрные и манежи</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                      <span className="text-base">3-разовое питание</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="text-base">Трансфер по запросу</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">от 2150₽</div>
                    <Button
                      className="w-full mt-2 py-4 text-lg shadow-lg bg-gradient-to-r from-primary to-primary/90"
                      onClick={scrollToBooking}
                    >
                      Забронировать базу
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="slide-up">
            Инфраструктура и услуги
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
            {[
              {
                icon: Dumbbell,
                title: "Спортивные объекты",
                features: [
                  "Стадион «Волгоград-Арена»",
                  "Футбольные манежи и залы",
                  "Тренажёрные залы",
                ],
              },
              {
                icon: Shield,
                title: "Безопасность",
                features: ["Охрана", "Медицинские пункты"],
              },
              {
                icon: UtensilsCrossed,
                title: "Питание и проживание",
                features: ["Гостиницы «НОЙ», «Волга-Волга»", "3-разовое питание"],
              },
              {
                icon: Users,
                title: "Удобства для команд",
                features: ["Комнаты для команд", "Прачечная, комната для инвентаря"],
              },
              {
                icon: MapPin,
                title: "Культурная программа",
                features: ["Посещение Музея «Сталинградская битва»", "Мемориал Мамаев Курган"],
              },
              {
                icon: Car,
                title: "Транспорт",
                features: ["Трансфер от/до аэропорта и вокзала"],
              },
            ].map((facility, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm" data-aos="zoom-in" data-aos-delay={100 + index * 100}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <facility.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{facility.title}</h3>
                  </div>
                  <ul className="text-base text-muted-foreground space-y-2">
                    {facility.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="slide-up">
            Готовы забронировать базу в Волгограде?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed" data-aos="fade" data-aos-delay="200">
            Оставьте заявку — менеджер рассчитает пакет и проконсультирует по программам и экскурсиям.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="zoom-in" data-aos-delay="400">
            <Button size="lg" onClick={scrollToBooking} className="text-lg py-6 px-8 shadow-lg bg-gradient-to-r from-primary to-primary/90">
              Оставить заявку
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg py-6 px-8 border-2">
              <Link href="tel:+74951234567">Позвонить сейчас</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold text-primary mb-4 inline-block">Team Rive</Link>
          <p className="text-gray-400">&copy; 2024 Team Rive. Все права защищены.</p>
        </div>
      </footer>

      {/* Fullscreen modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ touchAction: "none" }}
        >
          {/* close - always on top */}
          <button
            onClick={closeModal}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 1003,
              background: "rgba(0,0,0,0.45)",
              color: "white",
              border: "none",
              padding: 10,
              borderRadius: 999,
            }}
          >
            ✕
          </button>

          {/* desktop arrows */}
          <button
            onClick={prevImage}
            aria-label="Prev"
            style={{
              display: typeof window !== "undefined" && window.innerWidth >= 768 ? "flex" : "none",
              position: "absolute",
              left: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1002,
              background: "rgba(0,0,0,0.28)",
              color: "white",
              border: "none",
              padding: 12,
              borderRadius: 8,
            }}
          >
            ‹
          </button>

          <button
            onClick={nextImage}
            aria-label="Next"
            style={{
              display: typeof window !== "undefined" && window.innerWidth >= 768 ? "flex" : "none",
              position: "absolute",
              right: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1002,
              background: "rgba(0,0,0,0.28)",
              color: "white",
              border: "none",
              padding: 12,
              borderRadius: 8,
            }}
          >
            ›
          </button>

          {/* clickable halves (below close button) */}
          <div style={{ position: "absolute", inset: 0, zIndex: 1001, display: "flex" }} aria-hidden>
            <div style={{ flex: 1, height: "100%" }} onClick={(e) => { e.stopPropagation(); prevImage() }} />
            <div style={{ flex: 1, height: "100%" }} onClick={(e) => { e.stopPropagation(); nextImage() }} />
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation()
              if ((e as React.MouseEvent).clientX !== undefined) onModalAreaClick(e as React.MouseEvent)
            }}
            style={{ zIndex: 1002, maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100dvh - 32px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Large ${currentImageIndex + 1}`}
              draggable={false}
              style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8, touchAction: "manipulation", userSelect: "none" }}
            />
          </div>

          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.85)", fontSize: 13, zIndex: 1003 }}>
            Esc — выйти • Нажмите по левой/правой стороне экрана или свайпните для листания
          </div>
        </div>
      )}

      {/* Small AOS CSS */}
      <style jsx global>{`
        [data-aos] { opacity: 0; transform: translate3d(0,0,0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        [data-aos="fade"].aos-animate { opacity: 1; transform: none; }
        [data-aos="slide-up"] { transform: translate3d(0,50px,0); }
        [data-aos="slide-up"].aos-animate { opacity: 1; transform: translate3d(0,0,0); }
        [data-aos="fade-right"] { transform: translate3d(-50px,0,0); }
        [data-aos="fade-right"].aos-animate { opacity: 1; transform: translate3d(0,0,0); }
        [data-aos="fade-left"] { transform: translate3d(50px,0,0); }
        [data-aos="fade-left"].aos-animate { opacity: 1; transform: translate3d(0,0,0); }
        [data-aos="zoom-in"] { transform: scale(0.9); }
        [data-aos="zoom-in"].aos-animate { opacity: 1; transform: scale(1); }
        [data-aos="fade-up"] { transform: translate3d(0,30px,0); }
        [data-aos="fade-up"].aos-animate { opacity: 1; transform: translate3d(0,0,0); }
      `}</style>
    </div>
  )
}
