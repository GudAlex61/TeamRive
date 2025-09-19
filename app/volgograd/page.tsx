// app/volgograd/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Users, Dumbbell, Car, Wifi, UtensilsCrossed, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VolgogradPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  // IntersectionObserver-based AOS replacement
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
              const t = window.setTimeout(() => {
                doAnimate()
              }, delay)
              timeouts.push(t)
            }
            observer.unobserve(el) // behave like once:true
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
    window.scrollTo(0, 0)
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
    setModalOpen(true)
    document.body.style.overflow = "hidden"
  }
  const closeModal = () => {
    setModalOpen(false)
    document.body.style.overflow = ""
  }

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal()
      } else if (e.key === "ArrowRight") {
        nextImage()
      } else if (e.key === "ArrowLeft") {
        prevImage()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modalOpen, nextImage, prevImage])

  const scrollToBooking = () => {
    router.push("/?scrollTo=booking")
  }

  // Добавляем обработку для мобильных устройств: убираем hover эффекты на тачах
  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
      @media (hover: none) {
        *:hover {
          all: unset !important;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

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
              />

              <button 
                onClick={prevImage} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
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
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 ${
                    idx === currentImageIndex ? "border-primary shadow-lg" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`thumb ${idx + 1}`} className="w-full h-full object-cover" />
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
                  Для участников предусмотрено бесплатное посещение музея «Сталинградская битва» для детей до 17 лет, а также посещение Мемориала на Мамаевом кургане. Турниры и сборы проходят на стадионе «Волгоград-Арена», в комплексе «Зенит», а в зимнее время — в футбольном манеже г. Никитина (г. Волжский).
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Организуем трансфер, питание, медицинское сопровождение и тренировочные сессии под ключ.
                </p>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="400">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-white to-gray-50/50">
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
                      <span className="text-base">Тренажерные и манежи</span>
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
                  "Тренажёрные залы"
                ]
              },
              {
                icon: Shield,
                title: "Безопасность",
                features: [
                  "Охрана",
                  "Медицинские пункты"
                ]
              },
              {
                icon: UtensilsCrossed,
                title: "Питание и проживание",
                features: [
                  "Гостиницы «НОЙ», «Волга-Волга»",
                  "3-разовое питание"
                ]
              },
              {
                icon: Users,
                title: "Удобства для команд",
                features: [
                  "Комнаты для команд",
                  "Прачечная, комната для инвентаря"
                ]
              },
              {
                icon: MapPin,
                title: "Культурная программа",
                features: [
                  "Посещение Музея «Сталинградская битва»",
                  "Мемориал Мамаев Курган"
                ]
              },
              {
                icon: Car,
                title: "Транспорт",
                features: [
                  "Трансфер от/до аэропорта и вокзала"
                ]
              }
            ].map((facility, index) => (
              <Card 
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 100}
              >
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
            <Button 
              size="lg" 
              onClick={scrollToBooking} 
              className="text-lg py-6 px-8 shadow-lg bg-gradient-to-r from-primary to-primary/90"
            >
              Оставить заявку
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-lg py-6 px-8 border-2"
            >
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

      {/* Fullscreen modal for gallery */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button className="absolute top-6 right-6 z-60 bg-black/30 text-white rounded-full p-2" onClick={closeModal} aria-label="Close">
            ✕
          </button>

          <button className="absolute left-6 top-1/2 -translate-y-1/2 z-60 p-2 bg-black/30 rounded-full text-white" onClick={prevImage} aria-label="Prev">
            ‹
          </button>
          <div className="max-w-full max-h-full flex items-center justify-center">
            <img src={images[currentImageIndex]} alt={`Large ${currentImageIndex + 1}`} className="max-w-full max-h-[90vh] object-contain" />
          </div>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 z-60 p-2 bg-black/30 rounded-full text-white" onClick={nextImage} aria-label="Next">
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">Esc — выйти, свайп/клики по стрелкам — листать</div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx global>{`
        [data-aos] {
          opacity: 0;
          transform: translate3d(0, 0, 0);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        [data-aos="fade"] {
          transform: translate3d(0, 0, 0);
        }

        [data-aos="fade"].aos-animate {
          opacity: 1;
        }

        [data-aos="slide-up"] {
          transform: translate3d(0, 50px, 0);
        }

        [data-aos="slide-up"].aos-animate {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        [data-aos="fade-right"] {
          transform: translate3d(-50px, 0, 0);
        }

        [data-aos="fade-right"].aos-animate {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        [data-aos="fade-left"] {
          transform: translate3d(50px, 0, 0);
        }

        [data-aos="fade-left"].aos-animate {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        [data-aos="zoom-in"] {
          transform: scale(0.8);
        }

        [data-aos="zoom-in"].aos-animate {
          opacity: 1;
          transform: scale(1);
        }

        [data-aos="fade-up"] {
          transform: translate3d(0, 30px, 0);
        }

        [data-aos="fade-up"].aos-animate {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      `}</style>
    </div>
  )
}