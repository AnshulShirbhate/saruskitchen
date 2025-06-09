"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/CartContext"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isVeg: boolean
  flavor: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              product.isVeg ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {product.isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">Flavor: {product.flavor}</p>
        <p className="text-sm text-gray-600 mb-3">Category: {product.category}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-pink-600">₹{product.price}</span>
          <Button onClick={handleAddToCart} className="bg-pink-600 hover:bg-pink-700">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
