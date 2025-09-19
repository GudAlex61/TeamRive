// app/page.tsx
"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  MapPin,
  Users,
  Dumbbell,
  Car,
  Phone,
  Mail,
  MapIcon,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    base: "",
    checkin: "",
    checkout: "",
    people: "",
    sport: "",
    additional: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  // refs (для позиции попапа и клика вне)
  const rangeControlRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

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

  // Обработчик перехода с параметром scrollTo=booking
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get("scrollTo") === "booking") {
        // НЕ делаем window.scrollTo(0,0) — это вызывало резкий сдвиг вверх.
        // Даем страницe время смонтироваться, затем плавно скроллим к форме.
        const timer = window.setTimeout(() => {
          const bookingSection = document.getElementById("booking-form")
          bookingSection?.scrollIntoView({ behavior: "smooth", block: "start" })
          try {
            history.replaceState(null, "", window.location.pathname + window.location.hash)
          } catch {}
        }, 600)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const navigateToBase = (baseName: string) => {
    router.push(`/${baseName}`)
  }

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form")
    bookingSection?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/submit-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          base: formData.base,
          dates: `${formData.checkin} - ${formData.checkout}`,
          participants: formData.people,
          sport: formData.sport,
          message: formData.additional || "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit booking")
      }

      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          phone: "",
          email: "",
          base: "",
          checkin: "",
          checkout: "",
          people: "",
          sport: "",
          additional: "",
        })
      }, 3000)
    } catch (error) {
      console.error("Error submitting booking:", error)
      setSubmitError("Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  /* ---------------- Date range picker (single-month) ---------------- */
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selecting, setSelecting] = useState<"start" | "end">("start")

  const selectedStart = useMemo(() => (formData.checkin ? new Date(formData.checkin) : null), [formData.checkin])
  const selectedEnd = useMemo(() => (formData.checkout ? new Date(formData.checkout) : null), [formData.checkout])

  const startOfDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }

  const formatISO = (d: Date) => {
    const y = d.getFullYear()
    const m = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  function getMonthMatrix(year: number, month: number) {
    const first = new Date(year, month, 1)
    const firstWeekday = (first.getDay() + 6) % 7 // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDays = firstWeekday
    const totalCells = prevDays + daysInMonth
    const rows = Math.ceil(totalCells / 7)
    const matrix: (Date | null)[][] = []
    let dayCounter = 1 - prevDays
    for (let r = 0; r < rows; r++) {
      const week: (Date | null)[] = []
      for (let c = 0; c < 7; c++) {
        if (dayCounter < 1) {
          const d = new Date(year, month, dayCounter)
          week.push(d)
        } else if (dayCounter > daysInMonth) {
          const d = new Date(year, month, dayCounter)
          week.push(d)
        } else {
          week.push(new Date(year, month, dayCounter))
        }
        dayCounter++
      }
      matrix.push(week)
    }
    return matrix
  }

  const monthMatrix = useMemo(() => getMonthMatrix(calendarMonth.getFullYear(), calendarMonth.getMonth()), [calendarMonth])

  const dayInRange = (d: Date) => {
    if (!selectedStart || !selectedEnd) return false
    const s = startOfDay(selectedStart).getTime()
    const e = startOfDay(selectedEnd).getTime()
    const t = startOfDay(d).getTime()
    return t >= s && t <= e
  }

  const handleDayClick = (d: Date) => {
    const clicked = startOfDay(d)
    // if no start & end -> set start, switch to selecting end, don't close
    if (!formData.checkin && !formData.checkout) {
      handleInputChange("checkin", formatISO(clicked))
      setSelecting("end")
      return
    }

    // if start exists and no end -> set end (ensure order), DO NOT close (user will press Готово)
    if (formData.checkin && !formData.checkout) {
      const start = new Date(formData.checkin)
      const startMs = startOfDay(start).getTime()
      const clickedMs = clicked.getTime()
      if (clickedMs < startMs) {
        handleInputChange("checkin", formatISO(clicked))
        handleInputChange("checkout", formatISO(start))
      } else {
        handleInputChange("checkout", formatISO(clicked))
      }
      setSelecting("start")
      // DO NOT close here — wait for "Готово" or click outside
      return
    }

    // if both selected -> start new selection with clicked as start
    if (formData.checkin && formData.checkout) {
      handleInputChange("checkin", formatISO(clicked))
      handleInputChange("checkout", "")
      setSelecting("end")
      return
    }
  }

  const prevMonth = () => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  }

  useEffect(() => {
    // close on click outside popup
    if (!calendarOpen) return
    function onDoc(e: MouseEvent) {
      const target = e.target as Node
      if (popupRef.current && rangeControlRef.current && !popupRef.current.contains(target) && !rangeControlRef.current.contains(target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [calendarOpen])

  /* ---- segmented base switch helper ---- */
  const BASES = [
    { id: "anapa", label: "Анапа" },
    { id: "volgograd", label: "Волгоград" },
    { id: "tuapse", label: "Туапсе" },
  ]

  const onSelectBase = (id: string) => {
    handleInputChange("base", id)
  }

  /* ------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[80vh] sm:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* left / middle / right — middle немного шире */}
          <img
            src="/anapa/photo_2025-09-15_21-01-43.jpg?height=1080&width=1920"
            alt="Спорт 1"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: "polygon(0 0, 36% 0, 24% 100%, 0 100%)" }}
            data-aos="fade"
          />
          <img
            src="/football.jpg?.jpg?height=1080&width=1920"
            alt="Спорт 2"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: "polygon(36% 0, 76% 0, 76% 100%, 24% 100%)" }}
            data-aos="fade"
          />
          <img
            src="/anapa/photo_2025-09-15_21-01-43.jpg?height=1080&width=1920"
            alt="Спорт 3"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: "polygon(76% 0, 100% 0, 100% 100%, 64% 100%)" }}
            data-aos="fade"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/20" />
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4" data-aos="fade" data-aos-onload>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent" data-aos="slide-up" data-aos-delay="120">
            Организуйте идеальные спортивные сборы
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium" data-aos="slide-up" data-aos-delay="220">
            Арендуйте современные базы в Анапе, Волгограде и Туапсе для достижения победных результатов
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="zoom-in" data-aos-delay="320">
            <Button type="button" size="lg" className="hero-glow-button group relative overflow-hidden mx-auto" onClick={scrollToBooking}>
              <span className="relative z-10 flex items-center gap-3">
                Выбрать базу и забронировать
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 sm:mb-6" data-aos="slide-up">Наши преимущества</h2>
            <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto leading-relaxed" data-aos="fade">
              Всё необходимое для эффективных тренировок и комфортного проживания команды
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" data-aos="fade-up">
            {[
              { icon: Dumbbell, title: "Современная инфраструктура", description: "Новейшее оборудование и спортивные объекты" },
              { icon: Users, title: "Проживание и питание 'всё включено'", description: "Комфортные номера и качественное питание" },
              { icon: Car, title: "Трансфер от/до вокзала", description: "Удобная доставка команды к месту сборов" },
              { icon: Phone, title: "Круглосуточная поддержка", description: "Всегда готовы помочь и решить любые вопросы" },
            ].map((advantage, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:shadow-lg transition-shadow">
                  <advantage.icon className="w-6 h-6 sm:w-10 sm:h-10 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-lg sm:text-xl">{advantage.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bases */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 sm:mb-6" data-aos="slide-up">Наши базы</h2>
            <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto leading-relaxed" data-aos="fade">
              Выберите идеальную локацию для ваших спортивных сборов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" data-aos="zoom-in">
            {[
              { city: "Анапа", image: "/anapa/photo_2025-09-15_21-02-25.jpg?height=300&width=400", features: ["Собственное футбольное поле","Бассейн 25м","Современный тренажерный зал","Комнаты на 2-3 человека"], route: "anapa" },
              { city: "Волгоград", image: "/placeholder.svg?height=300&width=400", features: ["Легкоатлетический манеж","Крытый спортивный зал","Медицинский центр","Комфортные номера"], route: "volgograd" },
              { city: "Туапсе", image: "/placeholder.svg?height=300&width=400", features: ["Открытые теннисные корты","Олимпийский бассейн","SPA и восстановление","Вид на горы"], route: "tuapse" },
            ].map((base, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 border-0 shadow-lg" onClick={() => navigateToBase(base.route)}>
                <div className="relative h-56 sm:h-72 overflow-hidden">
                  <img src={base.image || "/placeholder.svg"} alt={`База в ${base.city}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium">От 2200 руб/чел</div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-serif">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    {base.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4 sm:mb-6">
                    {base.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-sm sm:text-base">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-base text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="font-medium">Нажмите для подробностей</span>
                    <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4 sm:mb-6" data-aos="slide-up">Как мы работаем</h2>
            <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto leading-relaxed" data-aos="fade">Простой и понятный процесс от заявки до проведения сборов</p>
          </div>
          <div className="max-w-4xl mx-auto" data-aos="fade-up">
            <div className="space-y-6 sm:space-y-8">
              {[
                { step: 1, title: "Выбор базы и дат", description: "Определите подходящую базу и желаемые даты проведения сборов" },
                { step: 2, title: "Заполнение заявки", description: "Оставьте заявку с указанием всех необходимых деталей" },
                { step: 3, title: "Звонок менеджера", description: "Наш менеджер свяжется с вами для уточнения деталей" },
                { step: 4, title: "Подтверждение брони", description: "Подтверждаем бронирование и заключаем договор" },
                { step: 5, title: "Заезд и проведение сборов", description: "Приезжайте и проводите эффективные тренировки" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 sm:gap-6 group hover:transform hover:translate-x-2 transition-all duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg sm:text-xl flex-shrink-0 group-hover:shadow-lg transition-shadow">
                    {item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg sm:text-2xl mb-2 sm:mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-5xl font-bold mb-4 sm:mb-6" data-aos="slide-up">Оставьте заявку на бронирование</h2>
            <p className="text-muted-foreground text-sm sm:text-xl leading-relaxed" data-aos="fade">Наш менеджер свяжется с вами в течение часа, чтобы ответить на все вопросы и рассчитать стоимость</p>
          </div>

          <Card className="max-w-2xl mx-auto overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-white to-gray-50/50" data-aos="zoom-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>
            <CardContent className="relative p-6 sm:p-10">
              {isSubmitted ? (
                <div className="text-center py-8 sm:py-12" data-aos="zoom-in">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">Заявка успешно отправлена!</h3>
                  <p className="text-muted-foreground text-sm sm:text-lg">Спасибо за вашу заявку. Наш менеджер свяжется с вами в ближайшее время.</p>
                </div>
              ) : (
                <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Имя *</Label>
                      <Input id="name" placeholder="Введите ваше имя" required value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm w-full" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Номер телефона *</Label>
                      <Input id="phone" type="tel" placeholder="+7 (999) 123-45-67" required value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm w-full" />
                    </div>
                  </div>

                  {/* --- Email (вставлено под имя и телефон, растянуто на всю строку) */}
                  <div data-aos="slide-up">
                    <Label htmlFor="email" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={isSubmitting}
                      className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm w-full"
                    />
                  </div>

                  {/* Выбор базы — SEGMENTED SWITCH (растянут, центрирован, отступы от краёв формы) */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <Label htmlFor="base" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Выбор базы *</Label>

                      <div className="mx-auto w-full max-w-[680px] px-0 sm:px-4">
                        <div role="radiogroup" aria-label="Выбор базы" className="flex w-full bg-white/90 border border-gray-200 rounded-2xl p-1 gap-1">
                          {BASES.map((b) => {
                            const selected = formData.base === b.id
                            return (
                              <button
                                key={b.id}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => onSelectBase(b.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    onSelectBase(b.id)
                                  }
                                }}
                                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-200 text-center whitespace-normal
                                  ${selected
                                    ? "bg-red-50 text-red-700 border border-red-100 shadow-sm"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-transparent"}
                                `}
                                style={{
                                  boxShadow: selected ? "0 8px 30px rgba(220,38,38,0.07)" : undefined,
                                }}
                              >
                                <span className="block break-words">{b.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Период проживания *</Label>

                      <div ref={rangeControlRef} className="relative inline-block w-full">
                        <div
                          className="range-picker relative rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm h-12 sm:h-14 px-3 sm:px-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:border-primary/50 transition-all duration-300"
                          role="button"
                          tabIndex={0}
                          onPointerDown={(e) => e.preventDefault()} /* prevent focus/scroll jump on pointer */
                          onMouseDown={(e) => e.preventDefault()} /* prevent focus/scroll jump */
                          onClick={() => {
                            setCalendarOpen((p) => !p)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              setCalendarOpen((p) => !p)
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-500" fill="none" aria-hidden>
                              <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V8H3v11a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className="text-sm sm:text-base text-gray-600">Выберите даты</div>
                          </div>

                          <div className="text-sm sm:text-base text-gray-700 flex items-center gap-3">
                            {formData.checkin ? (
                              <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs sm:text-sm">
                                {new Date(formData.checkin).toLocaleDateString('ru-RU')}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs sm:text-sm">Дата заезда</div>
                            )}

                            <span className="text-gray-300 text-xs sm:text-sm">—</span>

                            {formData.checkout ? (
                              <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs sm:text-sm">
                                {new Date(formData.checkout).toLocaleDateString('ru-RU')}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs sm:text-sm">Дата выезда</div>
                            )}
                          </div>
                        </div>

                        {/* Popup */}
                        {calendarOpen && (
                          <div
                            ref={popupRef}
                            className="drp-popup mt-2"
                            data-aos="zoom-in"
                            // Prevent this popup itself from ever keeping focus and causing scroll
                            tabIndex={-1}
                            onFocus={(e) => { (e.currentTarget as HTMLElement).blur() }}
                            onMouseDown={(e) => e.preventDefault()}
                            onPointerDown={(e) => e.preventDefault()}
                          >
                            <div className="drp-top flex items-center justify-between mb-2">
                              <div className="drp-nav flex items-center gap-2">
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={prevMonth}
                                  aria-label="Prev month"
                                  className="drp-nav-btn"
                                >
                                  ‹
                                </button>
                              </div>
                              <div className="drp-title text-sm font-medium text-gray-800">{calendarMonth.toLocaleString("ru-RU", { month: "long", year: "numeric" })}</div>
                              <div className="drp-nav flex items-center gap-2">
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={nextMonth}
                                  aria-label="Next month"
                                  className="drp-nav-btn"
                                >
                                  ›
                                </button>
                              </div>
                            </div>

                            <div className="drp-month-block">
                              <div className="drp-weekdays">
                                <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
                              </div>
                              <div className="drp-grid">
                                {monthMatrix.map((week, wi) =>
                                  week.map((d, di) => {
                                    if (!d) return <div key={`m0-${wi}-${di}`} className="drp-cell empty" />
                                    const isCurrentMonth = d.getMonth() === calendarMonth.getMonth()
                                    const isStart = isSameDay(d, selectedStart)
                                    const isEnd = isSameDay(d, selectedEnd)
                                    const inRange = dayInRange(d)
                                    const isToday = isSameDay(d, new Date())
                                    const classes = [
                                      "drp-cell",
                                      !isCurrentMonth ? "drp-cell--muted" : "",
                                      isToday ? "drp-cell--today" : "",
                                      (isStart || isEnd) ? "drp-cell--selected" : "",
                                      inRange && !(isStart || isEnd) ? "drp-cell--inrange" : "",
                                    ].filter(Boolean).join(" ")
                                    return (
                                      <div
                                        key={`m0-${wi}-${di}`}
                                        className={classes}
                                        onMouseDown={(e) => e.preventDefault()} /* prevent focus-induced scroll */
                                        onPointerDown={(e) => e.preventDefault()}
                                        onClick={() => handleDayClick(d)}
                                        title={d.toLocaleDateString("ru-RU")}
                                        tabIndex={-1} /* don't allow focusing by keyboard/navigation to avoid unexpected scroll */
                                        onFocus={(e) => { (e.currentTarget as HTMLElement).blur() }}
                                        role="button"
                                        aria-pressed={isStart || isEnd}
                                      >
                                        {d.getDate()}
                                      </div>
                                    )
                                  })
                                )}
                              </div>
                            </div>

                            <div className="drp-actions mt-3 flex items-center justify-between">
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                className="drp-clear text-sm text-gray-600"
                                onClick={() => { handleInputChange("checkin", ""); handleInputChange("checkout", ""); setSelecting("start") }}
                              >
                                Очистить
                              </button>
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">{formData.checkin ? new Date(formData.checkin).toLocaleDateString("ru-RU") : "—"} — {formData.checkout ? new Date(formData.checkout).toLocaleDateString("ru-RU") : "—"}</div>
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  className="drp-apply px-3 py-1 rounded-md text-white text-sm"
                                  onClick={() => setCalendarOpen(false)}
                                >
                                  Готово
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="people" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Количество человек *</Label>
                      <Input id="people" type="number" placeholder="Например: 15" required value={formData.people} onChange={(e) => handleInputChange("people", e.target.value)} disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm w-full" />
                    </div>
                    <div>
                      <Label htmlFor="sport" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Вид спорта *</Label>
                      <Input id="sport" placeholder="Например: Футбол" required value={formData.sport} onChange={(e) => handleInputChange("sport", e.target.value)} disabled={isSubmitting} className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm w-full" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional" className="text-base sm:text-lg font-semibold text-gray-800 mb-2 block">Дополнительные пожелания</Label>
                    <Textarea id="additional" placeholder="Укажите особые требования или пожелания к проведению сборов..." value={formData.additional} onChange={(e) => handleInputChange("additional", e.target.value)} disabled={isSubmitting} className="min-h-[100px] sm:min-h-[120px] text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm resize-none w-full" />
                  </div>

                  {submitError && <div className="text-red-600 text-base sm:text-lg bg-red-50 p-4 sm:p-6 rounded-xl border-2 border-red-200">{submitError}</div>}

                  <div className="flex justify-center">
                    <Button type="submit" className={`hero-glow-button ${isSubmitting ? "opacity-90 cursor-wait" : ""}`} disabled={isSubmitting} data-aos="zoom-in">
                      {isSubmitting ? (
                        <div className="relative z-10 flex items-center justify-center gap-3 w-full">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="text-sm sm:text-base">Отправляем заявку...</span>
                        </div>
                      ) : (
                        <div className="relative z-10 flex items-center justify-center gap-3 w-full">
                          <span className="text-sm sm:text-base">Отправить заявку</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-5xl font-bold text-center mb-8 sm:mb-16" data-aos="slide-up">Часто задаваемые вопросы</h2>
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4" data-aos="fade-up">
            {[
              { question: "Какова минимальная продолжительность аренды базы?", answer: "Минимальная продолжительность аренды составляет 3 дня. Это позволяет командам полноценно провести тренировочный процесс и адаптироваться к условиям базы." },
              { question: "Включено ли питание в стоимость аренды?", answer: "Да, все наши базы работают по системе 'всё включено'. В стоимость входит трёхразовое питание, проживание и использование всей спортивной инфраструктуры." },
              { question: "Можно ли привезти собственного повара?", answer: "Конечно! Мы предоставляем полностью оборудованную кухню, где ваш повар сможет готовить. При этом стоимость аренды будет пересчитана без учёта питания." },
            ].map((faq, index) => (
              <Collapsible key={index} open={openFaq === index} onOpenChange={() => toggleFaq(index)}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 sm:p-6 text-left hover:bg-muted/50 transition-colors">
                  <span className="font-semibold text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 text-muted-foreground text-sm sm:text-base leading-relaxed">{faq.answer}</CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">Team Rive</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-lg leading-relaxed">Современные спортивные базы для эффективных тренировок и комфортного проживания команд.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">Контакты</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-300">
                <div className="flex items-center gap-3"><Phone className="w-4 h-4" /><span className="text-sm sm:text-lg">+7 (495) 123-45-67</span></div>
                <div className="flex items-center gap-3"><Mail className="w-4 h-4" /><span className="text-sm sm:text-lg">info@teamrive.ru</span></div>
                <div className="flex items-center gap-3"><MapIcon className="w-4 h-4" /><span className="text-sm sm:text-lg">Москва, ул. Спортивная, 15</span></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">Наши базы</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-lg"><li>Анапа</li><li>Волгоград</li><li>Туапсе</li></ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 text-center text-gray-400"><p className="text-sm sm:text-lg">&copy; 2024 Team Rive. Все права защищены.</p></div>
        </div>
      </footer>

      {/* Calendar styles (single month, no hover transform on dates) + mobile / button behavior */}
      <style jsx global>{`
        .drp-popup {
          position: absolute;
          z-index: 70;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.06);
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(2,6,23,0.08);
          padding: 12px;
          width: 420px;
          max-width: calc(100vw - 32px);
          touch-action: manipulation;
          -webkit-overflow-scrolling: touch;
        }

        .drp-top { display:flex; align-items:center; justify-content:space-between; gap:8px }
        .drp-nav-btn { background: transparent; border: 0; padding: 6px; border-radius: 8px; cursor: pointer; color: #374151 }
        .drp-title { font-weight: 600; color: #111827; font-size: 14px }

        .drp-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 6px; }
        .drp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }

        .drp-cell {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          user-select: none;
          transition: background-color 120ms ease, color 120ms ease;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .drp-cell.empty { background: transparent; cursor: default; opacity: 0; }
        .drp-cell--muted { color: #9ca3af; opacity: 0.9; }

        .drp-cell--today {
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
        }

        .drp-cell--selected {
          background: #dc2626; /* strong red */
          color: white;
          font-weight: 700;
          box-shadow: 0 6px 18px rgba(220,38,38,0.14);
        }

        /* days inside selected range (light red) */
        .drp-cell--inrange {
          background: #fff2f2; /* very light red/pink */
          color: #b91c1c; /* darker red text */
        }

        .drp-actions { display:flex; gap:8px; justify-content:space-between; margin-top:10px; align-items:center }
        .drp-clear { background: transparent; border: 0; color: #6b7280; font-size:13px; cursor:pointer; padding:8px }
        .drp-apply {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
          color: white; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer;
        }

        .hero-glow-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 28px;
          border-radius: 16px;
          font-weight: 700;
          background: linear-gradient(135deg,#dc2626 0%, #b91c1c 50%, #991b1b 100%);
          border: 2px solid #dc2626;
          color: white;
          box-shadow:
            0 0 18px rgba(220,38,38,0.32),
            0 10px 30px rgba(0,0,0,0.2);
          transition: transform 260ms ease, box-shadow 260ms ease;
          max-width: 420px;
          width: auto;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* IMPORTANT: hover styles only on devices that actually support hover.
           Это предотвращает "первый тап — только hover" на тач-устройствах. */
        @media (hover: hover) and (pointer: fine) {
          .drp-cell:hover { background: #f8fafc; }
          .hero-glow-button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 0 28px rgba(220,38,38,0.45), 0 18px 40px rgba(0,0,0,0.25); }
          .hero-glow-button:active { transform: translateY(-1px) scale(0.99); }
          /* Дополнительные hover-правила для других элементов можно добавить сюда */
        }

        /* Mobile specific adjustments */
        @media (max-width: 640px) {
          .max-w-\\[680px\\] { max-width: 92vw; padding-left: 6px; padding-right: 6px; }

          /* make popup fixed and scrollable on small screens */
          .drp-popup {
            width: calc(100vw - 24px);
            left: 12px;
            right: 12px;
            bottom: 6vh;
            position: fixed;
            border-radius: 12px;
            max-height: calc(70vh);
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            z-index: 9999;
          }

          .drp-cell { height: 44px; font-size: 14px; }
          .drp-actions { align-items: center; gap: 6px }
          /* reduce radio buttons padding for mobiles */
          [role="radiogroup"] button { padding-top: 8px; padding-bottom: 8px; font-size: 13px; }
        }

        /* avoid accidental horizontal scroll */
        html, body, #__next {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}
