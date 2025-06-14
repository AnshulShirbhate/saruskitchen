// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { useCart } from "../context/CartContext"
// import ProductInterface from './ProductInterface';

// interface ProductCardProps {
//   product: ProductInterface
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const { dispatch } = useCart()

//   const handleAddToCart = () => {
//     dispatch({
//       type: "ADD_ITEM",
//       payload: {
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         image: product.image_url,
//         category: product.category,
//       },
//     })
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="relative h-48">
//         <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
//         <div className="absolute top-2 right-2">
//           <span
//             className={`px-2 py-1 text-xs rounded-full ${
//               product.isveg ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//             }`}
//           >
//             {product.isveg ? "Veg" : "Non-Veg"}
//           </span>
//         </div>
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//         <p className="text-sm text-gray-600 mb-2">Flavor: {product.flavor}</p>
//         <p className="text-sm text-gray-600 mb-3">Category: {product.category}</p>

//         <div className="flex items-center justify-between">
//           <span className="text-xl font-bold text-pink-600">₹{product.weights['500gm']}</span>
//           <Button onClick={handleAddToCart} className="bg-pink-600 hover:bg-pink-700">
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/CartContext"
import ProductInterface from './ProductInterface'

interface ProductCardProps {
  product: ProductInterface
}

const weightOptions = ["500gm", "1kg", "2kg", "3kg"] as const

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()
  const [selectedWeight, setSelectedWeight] = useState<keyof typeof product.weights>("500gm")

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        price: Number(product.weights[selectedWeight]),
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              product.isveg ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {product.isveg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-1">Flavor: {product.flavor}</p>
        <p className="text-sm text-gray-600 mb-3">Category: {product.category}</p>

        {/* Weight Selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {weightOptions.map((weight) => (
            <button
              key={weight}
              onClick={() => setSelectedWeight(weight)}
              disabled={!product.weights[weight]}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedWeight === weight
                  ? "bg-pink-600 text-white border-pink-600"
                  : "text-gray-700 border-gray-300"
              } ${!product.weights[weight] && "opacity-50 cursor-not-allowed"}`}
            >
              {weight}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-pink-600">
            ₹{product.weights[selectedWeight] || "N/A"}
          </span>
          <Button
            onClick={handleAddToCart}
            className="bg-pink-600 hover:bg-pink-700"
            disabled={!product.weights[selectedWeight]}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
