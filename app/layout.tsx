
import type React from "react";
import type { Metadata } from "next";
import { Inter, Poppins, Merriweather, Playfair_Display, Dancing_Script, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TopLoader from "nextjs-toploader";
import { Bounce, ToastContainer } from "react-toastify";
import ReduxProvider from "@/redux/ReduxProvider";
import ProductsInitializer from "./components/ProductsInitializer";

const inter = Inter({ subsets: ["latin"] });

export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-quicksand',
  display: 'swap',
});



export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME + " - Premium Homemade Cakes",
  description:
    `Discover our hygienic, quality homemade cakes with customizable options. Fresh, healthy, and delicious cakes made with love. Saru's Kitchen is a home bakery start up by Sarika Shirbhate and this website is made by her son Anshul Shirbhate.`,
  icons: {
    icon: "/images/favicon.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="F6RYRH5HC0uYEpqHoZfFyVKvFtNbJ1ISrfiRT2kLqS8" />
      </head>
      <body className={quicksand.className}>
        <ReduxProvider>
          <ProductsInitializer>
            <CartProvider>
              <TopLoader />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
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
            </CartProvider>
          </ProductsInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
