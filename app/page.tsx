"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, MapPin, Users, Dumbbell, Car, Phone, Mail, MapIcon, Trophy, Zap, CheckCircle } from "lucide-react"

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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const navigateToBase = (baseName: string) => {
    router.push(`/${baseName}`)
  }

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking-form")
    bookingSection?.scrollIntoView({ behavior: "smooth" })
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

      // Show success state
      setIsSubmitted(true)

      // Reset form after 3 seconds
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder - планируется динамичное фото спортсменов в действии */}
        <div className="absolute inset-0 z-0">
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Динамичные спортивные тренировки"
            className="w-full h-full object-cover scale-105 animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary/20"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 animate-fade-in">
          <div className="mb-6 flex justify-center">
            
          </div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent">
            Организуйте идеальные спортивные сборы
          </h1>
          <p className="text-2xl md:text-3xl mb-10 text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
            Арендуйте современные базы в Москве, Волгограде и Сочи для достижения победных результатов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25"
              onClick={scrollToBooking}
            >
              Выбрать базу и забронировать
            </Button>
            <div className="flex items-center gap-2 text-base text-gray-300">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-medium">Ответ в течение часа</span>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold mb-6">Наши преимущества</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Всё необходимое для эффективных тренировок и комфортного проживания команды
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Dumbbell,
                title: "Современная инфраструктура",
                description: "Новейшее оборудование и спортивные объекты",
              },
              {
                icon: Users,
                title: "Проживание и питание 'всё включено'",
                description: "Комфортные номера и качественное питание",
              },
              {
                icon: Car,
                title: "Трансфер от/до вокзала",
                description: "Удобная доставка команды к месту сборов",
              },
              {
                icon: Phone,
                title: "Круглосуточная поддержка",
                description: "Всегда готовы помочь и решить любые вопросы",
              },
            ].map((advantage, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-shadow">
                  <advantage.icon className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-4 text-xl">{advantage.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold mb-6">Наши базы</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Выберите идеальную локацию для ваших спортивных сборов
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: "Москва",
                image: "/placeholder.svg?height=300&width=400",
                features: [
                  "Собственное футбольное поле",
                  "Бассейн 25м",
                  "Современный тренажерный зал",
                  "Комнаты на 2-3 человека",
                ],
                route: "moscow",
              },
              {
                city: "Волгоград",
                image: "/placeholder.svg?height=300&width=400",
                features: [
                  "Легкоатлетический манеж",
                  "Крытый спортивный зал",
                  "Медицинский центр",
                  "Комфортные номера",
                ],
                route: "volgograd",
              },
              {
                city: "Сочи",
                image: "/placeholder.svg?height=300&width=400",
                features: ["Открытые теннисные корты", "Олимпийский бассейн", "SPA и восстановление", "Вид на горы"],
                route: "sochi",
              },
            ].map((base, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-105 border-0 shadow-lg"
                onClick={() => navigateToBase(base.route)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={base.image || "/placeholder.svg"}
                    alt={`База в ${base.city}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Доступно
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    {base.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {base.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-base">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
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

      {/* How We Work Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl font-bold mb-6">Как мы работаем</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
              Простой и понятный процесс от заявки до проведения сборов
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Выбор базы и дат",
                  description: "Определите подходящую базу и желаемые даты проведения сборов",
                },
                {
                  step: 2,
                  title: "Заполнение заявки",
                  description: "Оставьте заявку с указанием всех необходимых деталей",
                },
                {
                  step: 3,
                  title: "Звонок менеджера",
                  description: "Наш менеджер свяжется с вами для уточнения деталей",
                },
                { step: 4, title: "Подтверждение брони", description: "Подтверждаем бронирование и заключаем договор" },
                {
                  step: 5,
                  title: "Заезд и проведение сборов",
                  description: "Приезжайте и проводите эффективные тренировки",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 group hover:transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0 group-hover:shadow-lg transition-shadow">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold text-2xl mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-serif text-5xl font-bold mb-6">Оставьте заявку на бронирование</h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Наш менеджер свяжется с вами в течение часа, чтобы ответить на все вопросы и рассчитать стоимость
            </p>
          </div>

          <Card className="max-w-2xl mx-auto overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-white to-gray-50/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>
            <CardContent className="relative p-10">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-4">Заявка успешно отправлена!</h3>
                  <p className="text-muted-foreground text-lg">
                    Спасибо за вашу заявку. Наш менеджер свяжется с вами в ближайшее время.
                  </p>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Имя *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Введите ваше имя"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Номер телефона *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold text-gray-800 mb-3 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      disabled={isSubmitting}
                      className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="base" className="text-lg font-semibold text-gray-800 mb-3 block">
                      Выбор базы *
                    </Label>
                    <Select
                      value={formData.base}
                      onValueChange={(value) => handleInputChange("base", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <SelectValue placeholder="Выберите базу" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="moscow" className="text-lg py-3">
                          Москва
                        </SelectItem>
                        <SelectItem value="volgograd" className="text-lg py-3">
                          Волгоград
                        </SelectItem>
                        <SelectItem value="sochi" className="text-lg py-3">
                          Сочи
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="checkin" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Дата заезда *
                      </Label>
                      <Input
                        id="checkin"
                        type="date"
                        required
                        value={formData.checkin}
                        onChange={(e) => handleInputChange("checkin", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Дата выезда *
                      </Label>
                      <Input
                        id="checkout"
                        type="date"
                        required
                        value={formData.checkout}
                        onChange={(e) => handleInputChange("checkout", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="people" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Количество человек *
                      </Label>
                      <Input
                        id="people"
                        type="number"
                        placeholder="Например: 15"
                        required
                        value={formData.people}
                        onChange={(e) => handleInputChange("people", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sport" className="text-lg font-semibold text-gray-800 mb-3 block">
                        Вид спорта *
                      </Label>
                      <Input
                        id="sport"
                        placeholder="Например: Футбол"
                        required
                        value={formData.sport}
                        onChange={(e) => handleInputChange("sport", e.target.value)}
                        disabled={isSubmitting}
                        className="h-14 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional" className="text-lg font-semibold text-gray-800 mb-3 block">
                      Дополнительные пожелания
                    </Label>
                    <Textarea
                      id="additional"
                      placeholder="Укажите особые требования или пожелания к проведению сборов..."
                      value={formData.additional}
                      onChange={(e) => handleInputChange("additional", e.target.value)}
                      disabled={isSubmitting}
                      className="min-h-[120px] text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="text-red-600 text-lg bg-red-50 p-6 rounded-xl border-2 border-red-200">
                      {submitError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Отправляем заявку...
                      </div>
                    ) : (
                      "Отправить заявку"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-5xl font-bold text-center mb-16">Часто задаваемые вопросы</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Какова минимальная продолжительность аренды базы?",
                answer:
                  "Минимальная продолжительность аренды составляет 3 дня. Это позволяет командам полноценно провести тренировочный процесс и адаптироваться к условиям базы.",
              },
              {
                question: "Включено ли питание в стоимость аренды?",
                answer:
                  "Да, все наши базы работают по системе 'всё включено'. В стоимость входит трёхразовое питание, проживание и использование всей спортивной инфраструктуры.",
              },
              {
                question: "Можно ли привезти собственного повара?",
                answer:
                  "Конечно! Мы предоставляем полностью оборудованную кухню, где ваш повар сможет готовить. При этом стоимость аренды будет пересчитана без учёта питания.",
              },
            ].map((faq, index) => (
              <Collapsible key={index} open={openFaq === index} onOpenChange={() => toggleFaq(index)}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-6 text-left hover:bg-muted/50 transition-colors">
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6 pt-2 text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-3xl font-bold text-primary mb-6">Team Rive</h3>
              <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                Современные спортивные базы для эффективных тренировок и комфортного проживания команд.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-xl">Контакты</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">info@teamrive.ru</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapIcon className="w-5 h-5" />
                  <span className="text-lg">Москва, ул. Спортивная, 15</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-xl">Наши базы</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="text-lg">Москва</li>
                <li className="text-lg">Волгоград</li>
                <li className="text-lg">Сочи</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p className="text-lg">&copy; 2024 Team Rive. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
