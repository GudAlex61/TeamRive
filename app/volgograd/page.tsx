"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Activity,
  Heart,
  Car,
  Wifi,
  UtensilsCrossed,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VolgogradPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

  // Added useEffect to scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const images = [
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
    "/placeholder.svg?height=600&width=800",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const scrollToBooking = () => {
    router.push("/#booking-form")
    setTimeout(() => {
      const element = document.getElementById("booking-form")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Team Rive
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-lg text-muted-foreground hover:text-foreground">
              Главная
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-lg">Волгоград</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-serif font-bold">Спортивная база в Волгограде</h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <Badge variant="secondary" className="text-base px-4 py-2">
              Легкоатлетический манеж
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Спортивный зал
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Медицинский центр
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Проживание
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Питание
            </Badge>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`База в Волгограде - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white p-3 rounded-full transition-all duration-300"
              >
                <ChevronRight className="w-7 h-7" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-base">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 hover:scale-105 transition-all duration-300 ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description and Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Description */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-serif font-bold mb-8">О базе</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Спортивная база в Волгограде специализируется на подготовке легкоатлетов и команд игровых видов
                  спорта. Уникальный легкоатлетический манеж с современным покрытием позволяет проводить тренировки в
                  любую погоду и в любое время года.
                </p>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Крытый спортивный зал универсального назначения подходит для баскетбола, волейбола, гандбола и других
                  игровых видов спорта. Медицинский центр оснащен современным диагностическим оборудованием и
                  реабилитационными комплексами.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  База расположена в тихом районе города, что обеспечивает спокойную атмосферу для восстановления после
                  тренировок. Комфортабельные номера и качественное питание создают идеальные условия для эффективной
                  подготовки спортсменов.
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="font-semibold mb-6 text-xl">Быстрая информация</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Users className="w-6 h-6 text-primary" />
                      <span className="text-base">До 40 человек</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-6 h-6 text-primary" />
                      <span className="text-base">15 км от центра Волгограда</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Car className="w-6 h-6 text-primary" />
                      <span className="text-base">Трансфер включён</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Wifi className="w-6 h-6 text-primary" />
                      <span className="text-base">Бесплатный Wi-Fi</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-8 py-4 text-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
                    onClick={scrollToBooking}
                  >
                    Забронировать базу
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12">Инфраструктура и услуги</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Спортивные объекты</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Легкоатлетический манеж (200м)</li>
                  <li>• Универсальный спортзал</li>
                  <li>• Зал для силовых тренировок</li>
                  <li>• Открытые беговые дорожки</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Медицинский центр</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Кабинет спортивного врача</li>
                  <li>• Физиотерапевтический кабинет</li>
                  <li>• Массажные кабинеты</li>
                  <li>• Реабилитационное оборудование</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Питание</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Столовая на 60 мест</li>
                  <li>• Меню для спортсменов</li>
                  <li>• Индивидуальные диеты</li>
                  <li>• Спортивное питание</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Проживание</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Номера на 2-4 человека</li>
                  <li>• Удобства в номере</li>
                  <li>• Кондиционирование</li>
                  <li>• Интернет в номерах</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Дополнительные услуги</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Конференц-зал</li>
                  <li>• Библиотека</li>
                  <li>• Комната отдыха</li>
                  <li>• Охрана территории</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Транспорт</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Трансфер от/до аэропорта</li>
                  <li>• Трансфер от/до вокзала</li>
                  <li>• Автобусная парковка</li>
                  <li>• Легковая парковка</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-serif font-bold mb-6">Готовы забронировать базу в Волгограде?</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Свяжитесь с нами прямо сейчас, и наш менеджер рассчитает стоимость и поможет с организацией сборов
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={scrollToBooking}
              className="px-8 py-4 text-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Оставить заявку
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="px-8 py-4 text-lg hover:scale-105 hover:shadow-lg transition-all duration-300 bg-transparent"
            >
              <Link href="tel:+74951234567">Позвонить сейчас</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold text-primary mb-4 inline-block">
            Team Rive
          </Link>
          <p className="text-gray-400">&copy; 2024 Team Rive. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
