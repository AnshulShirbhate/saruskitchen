'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoadingComponent from "@/app/components/LoadingComponent";

interface Order {
  oid: number;
  total: number;
  order_date: string;
  customer: {
    name: string;
    phone: string;
  }
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
        setOrders(data.orders);
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
            <LoadingComponent loaderName={'Orders'}/>
          )
          :!orders || orders.length===0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders && orders.map((order) => (
                <li
                  key={order.oid}
                  className="p-4 border rounded-md hover:shadow-md transition"
                >
                  <Link href={`/orders/${order.oid}`} className="text-pink-600 font-medium hover:underline">
                    Order #{order.oid}
                  </Link>
                  <p>Customer: {order.customer.name}</p>
                  <p>Phone: {order.customer.phone}</p>
                  <p>Total: ₹{order.total}</p>
                  <p>Date of Order: {order.order_date && order.order_date.split('T')[0]}</p>

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
