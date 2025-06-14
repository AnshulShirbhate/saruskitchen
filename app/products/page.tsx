"use client"

import { useState, useMemo, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import FilterSidebar, { type FilterState } from "../components/FilterSidebar"
import ProductInterface from "../components/ProductInterface"

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    flavors: [],
    dietaryType: [],
    priceRange: [0, 5000],
  })

  const [products, setProducts] = useState<ProductInterface[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const response = await fetch("/api/getallproducts")
      const data = await response.json()
      if (response.ok) {
        setProducts(data.products)
      } else {
        console.error("Error fetching products:", data.message)
      }
    } catch (error) {
      console.error("Network error while fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!products) return []

    return products.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false
      }

      if (
        filters.flavors.length > 0 &&
        !filters.flavors.includes(product.flavor)
      ) {
        return false
      }

      if (filters.dietaryType.length > 0) {
        const isVegSelected = filters.dietaryType.includes("Veg")
        const isNonVegSelected = filters.dietaryType.includes("Non-Veg")

        if (isVegSelected && !isNonVegSelected && !product.isveg) return false
        if (isNonVegSelected && !isVegSelected && product.isveg) return false
        if (!isVegSelected && !isNonVegSelected) return false
      }

      const priceList = Object.values(product.weights)
        .filter(Boolean)
        .map((price) => parseInt(price))
        .filter((n) => !isNaN(n))

      const minPrice = Math.min(...priceList)

      if (
        isNaN(minPrice) ||
        minPrice < filters.priceRange[0] ||
        minPrice > filters.priceRange[1]
      ) {
        return false
      }

      return true
    })
  }, [filters, products])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading products...</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <FilterSidebar onFilterChange={setFilters} />
            </div>

            {/* Products */}
            <div className="lg:w-3/4">
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {filteredProducts?.length || 0} of{" "}
                  {products?.length || 0} products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts &&
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>

              {filteredProducts && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
