// app/tuapse/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin, Users, Dumbbell, Waves, Car, Wifi, UtensilsCrossed, Shield, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TuapsePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)

  const scrollToBooking = () => {
    // Переход на главную страницу с параметром для скролла к форме
    router.push("/?scrollTo=booking")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b" data-aos="fade" data-aos-onload>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300">Team Rive</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4" data-aos="slide-up" data-aos-delay="200">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-300">Главная</Link>
            <span className="text-muted-foreground">/</span>
            <span>Туапсе</span>
          </div>

          <div className="flex items-center gap-3 mb-6" data-aos="slide-up" data-aos-delay="300">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Спортивная база — Туапсе</h1>
            <div className="ml-4">
              <Badge variant="secondary" className="text-base px-3 py-2 hover:scale-105 transition-transform duration-300">от 2100₽</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8" data-aos="slide-up" data-aos-delay="400">
            <Badge variant="secondary" className="hover:scale-105 transition-transform duration-300">Проживание в отеле</Badge>
            <Badge variant="secondary" className="hover:scale-105 transition-transform duration-300">3-разовое питание</Badge>
            <Badge variant="secondary" className="hover:scale-105 transition-transform duration-300">~50 м до моря</Badge>
            <Badge variant="secondary" className="hover:scale-105 transition-transform duration-300">Бассейн и аквапарк</Badge>
            <Badge variant="secondary" className="hover:scale-105 transition-transform duration-300">Спортивные площадки</Badge>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto" data-aos="zoom-in" data-aos-delay="400">
            <div className="relative h-96 md:h-[520px] rounded-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`Туапсе - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />

              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
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
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 hover:scale-105 transition-all duration-300 ${
                    idx === currentImageIndex ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
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
              <h2 className="text-3xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">О базе — Туапсе</h2>
              <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-muted-foreground text-lg leading-relaxed hover:text-foreground transition-colors duration-300">
                  В пакет (от 2100₽) входит проживание в отеле «Меркурий» или «Автотурист», трёхразовое питание и курортный сбор. Отели расположены примерно в 50 метрах от моря, что делает базу идеальной для восстановления между тренировками.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed hover:text-foreground transition-colors duration-300">
                  На территории отелей — бассейны, аквапарк и спортивные площадки. Турнирные матчи и тренировки проходят на стадионе «Водник» и в спортивном комплексе «Дельфин», а также в крытых манежах в зимнее время.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed hover:text-foreground transition-colors duration-300">
                  Организуем трансфер, питание, медицинское сопровождение и полный спектр услуг для комфортного проведения тренировочных сборов.
                </p>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="400">
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white via-white to-gray-50/50 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-lg pointer-events-none"></div>
                <CardContent className="relative p-6">
                  <h3 className="font-semibold mb-4 text-xl">Быстрая информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-base">Команды до 40 человек</span>
                    </div>
                    <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-base">~50 м до моря</span>
                    </div>
                    <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                      <Waves className="w-5 h-5 text-primary" />
                      <span className="text-base">Бассейн и аквапарк</span>
                    </div>
                    <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                      <span className="text-base">3-разовое питание</span>
                    </div>
                    <div className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="text-base">Трансфер по запросу</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">от 2100₽</div>
                    <Button 
                      className="w-full mt-2 py-4 text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" 
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
                  "Стадион «Водник»",
                  "Спортивный комплекс «Дельфин»",
                  "Крытые манежи для зимних тренировок"
                ]
              },
              {
                icon: Waves,
                title: "Отдых и восстановление",
                features: [
                  "Бассейны на территории отелей",
                  "Аквапарк",
                  "Доступ к морю (~50 м)"
                ]
              },
              {
                icon: UtensilsCrossed,
                title: "Питание и проживание",
                features: [
                  "Отели «Меркурий», «Автотурист»",
                  "3-разовое питание",
                  "Меню для спортсменов"
                ]
              },
              {
                icon: Gamepad2,
                title: "Развлечения",
                features: [
                  "Аквапарк на территории",
                  "Спортивные площадки",
                  "Развлекательные программы"
                ]
              },
              {
                icon: Shield,
                title: "Безопасность",
                features: [
                  "Охраняемая территория",
                  "Медицинское сопровождение"
                ]
              },
              {
                icon: Car,
                title: "Транспорт",
                features: [
                  "Трансфер от/до аэропорта и вокзала",
                  "Организация поездок на тренировки"
                ]
              }
            ].map((facility, index) => (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 100}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <facility.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{facility.title}</h3>
                  </div>
                  <ul className="text-base text-muted-foreground space-y-2">
                    {facility.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 group-hover:translate-x-2 transition-transform duration-300">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                        <span className="group-hover:text-foreground transition-colors">{feature}</span>
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
            Готовы забронировать базу в Туапсе?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed" data-aos="fade" data-aos-delay="200">
            Оставьте заявку — менеджер рассчитает стоимость пакета и проконсультирует по всем услугам.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="zoom-in" data-aos-delay="400">
            <Button 
              size="lg" 
              onClick={scrollToBooking} 
              className="text-lg py-6 px-8 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              Оставить заявку
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="text-lg py-6 px-8 hover:scale-105 transition-all duration-300 border-2 hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="tel:+74951234567">Позвонить сейчас</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold text-primary mb-4 inline-block hover:scale-105 transition-transform duration-300">Team Rive</Link>
          <p className="text-gray-400">&copy; 2024 Team Rive. Все права защищены.</p>
        </div>
      </footer>

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