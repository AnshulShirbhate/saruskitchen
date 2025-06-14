import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./context/CartContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import TopLoader from "./components/TopLoader"
import { Bounce, ToastContainer } from "react-toastify"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME+" - Premium Homemade Cakes",
  description:
    "Discover our hygienic, quality homemade cakes with customizable options. Fresh, healthy, and delicious cakes made with love.",
    generator: 'v0.dev',
    icons: {
    icon: "/images/favicon.png", // path relative to the /public directory
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            <TopLoader />
            {children}
            </main>
          <Footer />
        </CartProvider>
        <ToastContainer
position="bottom-center"
autoClose={2000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
      </body>
    </html>
  )
}
