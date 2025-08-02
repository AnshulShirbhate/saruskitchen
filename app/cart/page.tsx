"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function CartPage() {
  const router = useRouter();
  const user = useSelector((state: RootState)=>{
    return state.user.user;
  })
  const { state, dispatch } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);


  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cartInfo: state.items}),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, {
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
        dispatch({ type: "CLEAR_CART" });
        router.push("/order-success");
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
      setIsCheckingOut(false);
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE10") {
      setDiscountPercent(10);
      toast.success("10% discount applied!", { position: "bottom-center" });
    } else if (code === "SAVE5") {
      setDiscountPercent(5);
      toast.success("5% discount applied!", { position: "bottom-center" });
    } else {
      setDiscountPercent(0);
      toast.error("Invalid coupon code", { position: "bottom-center" });
    }
  };

  const discountAmount = Math.round((state.total * discountPercent) / 100);
  const finalTotal = state.total - discountAmount;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some delicious cakes to get started!
          </p>
          <Link href="/allproducts">
            <Button className="bg-pink-600 hover:bg-pink-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({state.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div
                      key={
                        item.pid +
                        Math.random() * new Date().getUTCMilliseconds()
                      }
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-20 h-20 relative ">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-sm text-gray-600">{item.weight}</p>
                        <p className="text-lg font-bold text-pink-600">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-center space-x-2 ">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.pid, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-2 w-2 md:h-4 md:w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              item.pid,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className="w-10 md:w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.pid, item.quantity + 1)
                          }
                        >
                          <Plus className="h-2 w-2 md:h-4 md:w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.pid)}
                          className="text-red-600 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Input */}
                <div className="flex items-center space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1"
                    disabled={discountPercent > 0}
                  />
                  {discountPercent > 0 ? (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setCouponCode("");
                        setDiscountPercent(0);
                        toast.info("Coupon removed", {
                          position: "bottom-center",
                        });
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApplyCoupon}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      Apply
                    </Button>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{state.total}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({discountPercent}%):</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                {/* <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%):</span>
                  <span>₹{Math.round(state.total * 0.05)}</span>
                </div> */}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{finalTotal}</span>
                </div>


                <Button
                  onClick={handleCheckout}
                  disabled={
                    isCheckingOut 
                  }
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Free candles on orders above ₹1000</p>
                  <p>• Promise of freshness and the highest hygiene</p>
                  <p>• 100% satisfaction guaranteed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
