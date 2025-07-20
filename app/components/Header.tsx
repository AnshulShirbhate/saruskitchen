"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { AppDispatch } from "@/redux/store";
import { setAdmin } from "@/redux/adminSlice";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setLoggedIn } from "@/redux/userSlice";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const isAdmin = useSelector((state: RootState) => state.admin.isAdmin);
  const userLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Custom Cakes", href: "/custom-cakes" },
    { name: "About", href: "/about" },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout");
      const data = await res.json();

      if (res.ok) {
        dispatch(setAdmin(false));
        dispatch(setLoggedIn(false));
        toast.success("Successfully Logged Out!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        window.location.href = "/login";
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-110">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              {/* <span className="text-white font-bold text-lg">CC</span> */}
              <Image
                alt="SarusKitchen Logo"
                src={"/images/bakery-illustration.png"}
                width={200}
                height={200}
              />
            </div>
            <div className="flex flex-col ">
              <span className="text-lg md:text-2xl font-bold text-pink-600 ">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
              <span className="text-gray-500 text-xs">by Sarika Shirbhate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${item.name === "Custom Cakes"
                    ? "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 text-white shadow-lg  hover:scale-105"
                    : "text-gray-700 hover:text-pink-600  hover:scale-110"
                  }`}
              >
                {item.name === "Custom Cakes" ? "🎂 Custom Cakes" : item.name}
                {item.name === "Custom Cakes" && (
                  <span className="absolute -top-2 -right-4 bg-yellow-300 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow">
                    NEW
                  </span>
                )}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href={"/admin/addproduct"}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600 hover:scale-110`}
              >
                Add Product
              </Link>
            )}

            {userLoggedIn ? (
              <>
                <Link
                  href={"/orders"}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600 hover:scale-110`}
                >
                  Orders
                </Link>

                <div className="relative group">
                  <button
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                  >
                    <Image
                      src="/placeholder-user.jpg"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-pink-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-t-xl transition-colors"
                    >
                      <Link href={'/myprofile'}>
                        My Profile
                      </Link>
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-b-xl transition-colors"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={"/login"}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600 hover:scale-110`}
              >
                Login
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {userLoggedIn && <div className="relative group md:hidden">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              >
                <Image
                  src="/placeholder-user.jpg"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-pink-100 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                <button
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-t-xl transition-colors"
                >
                  <Link href={'/myprofile'}>
                    My Profile
                  </Link>
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-b-xl transition-colors"
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                >
                  Logout
                </button>
              </div>
            </div>}
            <Link href={"/cart"} className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-pink-600" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative block px-4 py-2 text-base font-medium rounded-md transition-all duration-300 ${item.name === "Custom Cakes"
                      ? "bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 text-white shadow-lg hover:scale-105"
                      : "text-gray-700 hover:text-pink-600"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name === "Custom Cakes" ? "🎂 Custom Cakes" : item.name}
                  {item.name === "Custom Cakes" && (
                    <span className="absolute -top-2 -right-4 bg-yellow-300 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow">
                      NEW
                    </span>
                  )}
                </Link>
              ))}

              {userLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      href={"/admin/addproduct"}
                      className="relative block px-4 py-2 text-base font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600"
                    >
                      Add Product
                    </Link>
                  )}
                  <Link
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    href={"/orders"}
                    className="relative block px-4 py-2 text-base font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600"
                  >
                    Orders
                  </Link>

                </>
              ) : (
                <Link
                  href={"/login"}
                  className="relative block px-4 py-2 text-base font-medium rounded-md transition-all duration-300 text-gray-700 hover:text-pink-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
