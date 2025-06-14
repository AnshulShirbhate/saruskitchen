"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  categories: string[]
  flavors: string[]
  dietaryType: string[]
  priceRange: [number, number]
}

const categories = ["cakes", "pastries", "desserts", "cupcakes"]
const flavors = ["Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Black Forest", "Butterscotch"]
const dietaryTypes = ["Veg", "Non-Veg"]

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    flavors: [],
    dietaryType: [],
    priceRange: [0, 5000],
  })

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleFlavorChange = (flavor: string, checked: boolean) => {
    const newFlavors = checked ? [...filters.flavors, flavor] : filters.flavors.filter((f) => f !== flavor)

    const newFilters = { ...filters, flavors: newFlavors }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDietaryTypeChange = (type: string, checked: boolean) => {
    const newDietaryType = checked ? [...filters.dietaryType, type] : filters.dietaryType.filter((t) => t !== type)

    const newFilters = { ...filters, dietaryType: newDietaryType }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      categories: [],
      flavors: [],
      dietaryType: [],
      priceRange: [0, 5000] as [number, number],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Flavors */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Flavors</h4>
        <div className="space-y-2">
          {flavors.map((flavor) => (
            <div key={flavor} className="flex items-center space-x-2">
              <Checkbox
                id={`flavor-${flavor}`}
                checked={filters.flavors.includes(flavor)}
                onCheckedChange={(checked) => handleFlavorChange(flavor, checked as boolean)}
              />
              <Label htmlFor={`flavor-${flavor}`} className="text-sm">
                {flavor}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary Type */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Dietary Type</h4>
        <div className="space-y-2">
          {dietaryTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${type}`}
                checked={filters.dietaryType.includes(type)}
                onCheckedChange={(checked) => handleDietaryTypeChange(type, checked as boolean)}
              />
              <Label htmlFor={`dietary-${type}`} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceRangeChange}
            max={5000}
            min={0}
            step={100}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
