'use client'

import Link from "next/link"
import Image from "next/image"
import Carousel from "./components/Carousel"
import FeaturesSection from "./components/FeaturesSection"
import ProductCard from "./components/ProductCard"
import { Button } from "@/components/ui/button"
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from "@/redux/store"
import LoadingComponent from "./components/LoadingComponent"

export default function Home() {
    const products = useSelector((state: RootState)=>{
      return state.products.products;
    })
    const loading = useSelector((state: RootState) =>{
      return state.products.loading;
    })
  const topProducts = products && products.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative" id="top">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-0 py-0">
          <Carousel />
        </div>
      </section>


      {/* Top Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Top Picks</h2>
            <Link href="/allproducts">
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                View All Products
              </Button>
            </Link>
          </div>

           {loading ? (
          <LoadingComponent loaderName={'Products'}/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
            {topProducts && topProducts.map((product) => (
              <ProductCard key={product.pid} product={product} />
            ))}
          </div>)}
        </div>
      </section>


      {/* Bakery Illustration Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto mb-8">
            <Image
              src="/images/bakery-illustration.png"
              alt="Creamy Creations Bakery"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Sweet World</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step into our magical bakery where every cake tells a story and every bite creates a memory. We believe in
            the power of sweetness to bring people together.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  )
}
