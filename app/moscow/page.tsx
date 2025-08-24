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
  Dumbbell,
  Waves,
  Car,
  Wifi,
  UtensilsCrossed,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MoscowPage() {
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
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Главная
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Москва</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-5xl font-serif font-bold">Спортивная база в Москве</h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">Футбольное поле</Badge>
            <Badge variant="secondary">Бассейн 25м</Badge>
            <Badge variant="secondary">Тренажерный зал</Badge>
            <Badge variant="secondary">Проживание</Badge>
            <Badge variant="secondary">Питание</Badge>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={`База в Москве - фото ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white p-2 rounded-full transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white p-2 rounded-full transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Description */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-6">О базе</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Современная спортивная база в Москве предлагает идеальные условия для проведения тренировочных сборов.
                  Расположенная в экологически чистом районе, база сочетает в себе профессиональную спортивную
                  инфраструктуру и комфортные условия проживания.
                </p>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Собственное футбольное поле с натуральным покрытием соответствует всем международным стандартам.
                  25-метровый бассейн оборудован современной системой очистки воды и подогрева. Тренажерный зал оснащен
                  профессиональным оборудованием ведущих мировых производителей.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Команды размещаются в комфортабельных номерах на 2-3 человека с современными удобствами. Трёхразовое
                  питание разработано специально для спортсменов с учётом энергетических потребностей и
                  сбалансированного рациона.
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-xl">Быстрая информация</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-base">До 50 человек</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-base">30 км от центра Москвы</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-primary" />
                      <span className="text-base">Трансфер включён</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-primary" />
                      <span className="text-base">Бесплатный Wi-Fi</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 hover:scale-105 hover:shadow-lg transition-all duration-300 text-lg py-6 px-8"
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
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-8">Инфраструктура и услуги</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Спортивные объекты</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Футбольное поле (105x68м)</li>
                  <li>• Тренажерный зал (200 кв.м)</li>
                  <li>• Зал для игровых видов спорта</li>
                  <li>• Беговые дорожки</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Waves className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Водные процедуры</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Бассейн 25м (6 дорожек)</li>
                  <li>• Сауна</li>
                  <li>• Джакузи</li>
                  <li>• Душевые кабины</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Питание</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Ресторан на 80 мест</li>
                  <li>• Спортивное меню</li>
                  <li>• Диетическое питание</li>
                  <li>• Кафе-бар</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Проживание</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Номера на 2-3 человека</li>
                  <li>• Кондиционер в каждом номере</li>
                  <li>• Собственная ванная</li>
                  <li>• Телевизор и Wi-Fi</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Дополнительные услуги</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Медицинский кабинет</li>
                  <li>• Массажный кабинет</li>
                  <li>• Прачечная</li>
                  <li>• Охраняемая территория</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Транспорт</h3>
                </div>
                <ul className="text-base text-muted-foreground space-y-2">
                  <li>• Трансфер от/до аэропорта</li>
                  <li>• Трансфер от/до вокзала</li>
                  <li>• Парковка для автобусов</li>
                  <li>• Легковая парковка</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Готовы забронировать базу в Москве?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Свяжитесь с нами прямо сейчас, и наш менеджер рассчитает стоимость и поможет с организацией сборов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={scrollToBooking}
              className="hover:scale-105 hover:shadow-lg transition-all duration-300 text-lg py-6 px-8"
            >
              Оставить заявку
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="hover:scale-105 hover:shadow-lg transition-all duration-300 bg-transparent text-lg py-6 px-8"
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
