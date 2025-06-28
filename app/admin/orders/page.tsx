'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Order {
  order_id: number;
  customer_name: string;
  customer_phone: string;
  total: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }finally{
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
              <span className="ml-4 text-gray-600 text-lg">
                Loading products...
              </span>
            </div>
          )
          :!orders || orders.length===0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders && orders.map((order) => (
                <li
                  key={order.order_id}
                  className="p-4 border rounded-md hover:shadow-md transition"
                >
                  <Link href={`/orders/${order.order_id}`} className="text-pink-600 font-medium hover:underline">
                    Order #{order.order_id}
                  </Link>
                  <p>Customer: {order.customer_name}</p>
                  <p>Phone: {order.customer_phone}</p>
                  <p>Total: ₹{order.total}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
