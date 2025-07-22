import Link from "next/link"
import { Instagram, Mail, Phone } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <a href="#top" className="flex items-center space-x-2 mb-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <Image alt="SarusKitchen Logo" src={'/images/bakery-illustration.png'} width={200} height={200}/>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-pink-400">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                <span className="text-xs">By Sarika Shirbhate</span>
              </div>
            </a>
            <p className=" mb-4">
              Creating delicious, hygienic, and customizable cakes with love. Your satisfaction is our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className=" hover:text-pink-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/allproducts" className=" hover:text-pink-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/custom-cakes" className=" hover:text-pink-400">
                  Custom Cakes
                </Link>
              </li>
              <li>
                <Link href="/about" className=" hover:text-pink-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+1234567890" className="flex items-center space-x-2  hover:text-pink-400">
                <Phone className="h-4 w-4" />
                <span>+91 9423623115</span>
              </a>
              <a
                href="mailto:sarikashirbhate1234@gmail.com"
                className="flex items-center space-x-2  hover:text-pink-400"
              >
                <Mail className="h-4 w-4" />
                <span>sarikashirbhate1234@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/creamy_creation_15/"
                className="flex items-center space-x-2  hover:text-pink-400"
              >
                <Instagram className="h-4 w-4" />
                <span>@creamycreations</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="">© 2024 {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.</p>
          <p>Made with 💙 by <a href="https://www.linkedin.com/in/anshulshirbhate/" className="hover:text-blue-500 transition"> 
          <span className="inline-block hover:scale-105 transition-transform">
            Anshul Shirbhate
          </span></a></p>
        </div>
      </div>
    </footer>
  )
}
