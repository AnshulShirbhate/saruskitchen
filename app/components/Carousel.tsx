"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const carouselImages = [
  {
    src: "/images/chocolatecake.jpg",
    alt: "Delicious chocolate cake with berries",
    title: "Premium Chocolate Cakes",
    description: "Rich, moist, and irresistibly delicious",
  },
  {
    src: "/images/fruitcake.jpg",
    alt: "Fresh fruit cake with cream",
    title: "Fresh Fruit Delights",
    description: "Made with the freshest seasonal fruits",
  },
  {
    src: "/images/weddingcake.jpg",
    alt: "Custom wedding cake",
    title: "Custom Wedding Cakes",
    description: "Make your special day even more memorable",
  },
  {
    src: "/images/cupcakes.jpg",
    alt: "Variety of cupcakes",
    title: "Artisan Cupcakes",
    description: "Perfect for any celebration",
  },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div className="relative w-full h-96 md:h-[600px] overflow-hidden rounded-lg">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{image.title}</h2>
              <p className="text-lg md:text-xl">{image.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
