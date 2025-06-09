"use client"

import { useState, useMemo } from "react"
import ProductCard from "../components/ProductCard"
import FilterSidebar, { type FilterState } from "../components/FilterSidebar"
import { products } from "../data/products"

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    flavors: [],
    dietaryType: [],
    priceRange: [0, 5000],
  })

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Flavor filter
      if (filters.flavors.length > 0 && !filters.flavors.includes(product.flavor)) {
        return false
      }

      // Dietary type filter
      if (filters.dietaryType.length > 0) {
        const isVegFilter = filters.dietaryType.includes("Veg")
        const isNonVegFilter = filters.dietaryType.includes("Non-Veg")

        if (isVegFilter && !isNonVegFilter && !product.isVeg) return false
        if (isNonVegFilter && !isVegFilter && product.isVeg) return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="mb-4">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
