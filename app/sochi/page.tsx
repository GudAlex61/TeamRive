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
  Waves,
  Mountain,
  Car,
  Wifi,
  UtensilsCrossed,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SochiPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()

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
            <span className="text-lg">Сочи</span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-5xl font-serif font-bold">Спортивная база в Сочи</h1>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <Badge variant="secondary" className="text-base px-4 py-2">
              Теннисные корты
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Олимпийский бассейн
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              SPA центр
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Вид на горы
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
                alt={`База в Сочи - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

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
                  Спортивная база в Сочи предлагает уникальное сочетание высокогорных тренировок и морского климата.
                  Расположенная в живописном районе с видом на Кавказские горы, база обеспечивает идеальные условия для
                  подготовки спортсменов различных специализаций.
                </p>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Открытые теннисные корты с профессиональным покрытием позволяют тренироваться круглый год благодаря
                  мягкому климату. Олимпийский бассейн оснащен системой подогрева и соответствует международным
                  стандартам. SPA-центр с современным оборудованием обеспечивает качественное восстановление после
                  тренировок.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Особая атмосфера горного курорта способствует психологической разгрузке и повышению мотивации
                  спортсменов. Чистый горный воздух и живописные пейзажи создают идеальную среду для концентрации на
                  спортивных целях и достижении высоких результатов.
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
                      <span className="text-base">До 35 человек</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-6 h-6 text-primary" />
                      <span className="text-base">20 км от центра Сочи</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mountain className="w-6 h-6 text-primary" />
                      <span className="text-base">Высота 500м над уровнем моря</span>
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
                    <Mountain className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Спортивные объекты</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• 4 теннисных корта (хард)</li>
                  <li>• Многофункциональный зал</li>
                  <li>• Тренажерный зал</li>
                  <li>• Беговые дорожки в горах</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Waves className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Водный комплекс</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Олимпийский бассейн (50м)</li>
                  <li>• Детский бассейн</li>
                  <li>• Аквазона для восстановления</li>
                  <li>• Подогрев воды круглый год</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">SPA и восстановление</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Финская сауна</li>
                  <li>• Турецкая баня</li>
                  <li>• Массажные кабинеты</li>
                  <li>• Криотерапия</li>
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
                  <li>• Ресторан с панорамным видом</li>
                  <li>• Кавказская кухня</li>
                  <li>• Спортивное питание</li>
                  <li>• Веганское меню</li>
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
                  <li>• Номера с видом на горы</li>
                  <li>• Балконы в каждом номере</li>
                  <li>• Премиум удобства</li>
                  <li>• Мини-бар и сейф</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Транспорт и досуг</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Трансфер от/до аэропорта</li>
                  <li>• Экскурсии по горам</li>
                  <li>• Прогулки к морю</li>
                  <li>• Охраняемая парковка</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-serif font-bold mb-6">Готовы забронировать базу в Сочи?</h2>
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
