// app/order-success/page.tsx
"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-xl text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-700 mb-4">
          Thank you for your order. We've received your request and will be in touch within the next <span className="font-semibold text-pink-600">12 hours</span>.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          We take pride in crafting cakes with love, hygiene, and perfection. A confirmation message has been sent to your phone. 🎂✨
        </p>

        <Link href="/products">
          <Button className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-6 py-2 rounded-full transition duration-300">
            Browse More Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
