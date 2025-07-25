
'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoadingComponent from "@/app/components/LoadingComponent";
import { motion } from "framer-motion";

interface Order {
  oid: number;
  total: number;
  order_date: string;
  customer: {
    name: string;
    phone: string;
    email: string
  };
}

const AllOrders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getallorders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 md:px-10">
      <Card className="max-w-5xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center md:text-left">
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingComponent loaderName={"Orders"} />
          ) : !orders || orders.length === 0 ? (
            <p className="text-gray-600 text-center">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <motion.li
                  key={order.oid}
                  className="p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href={`/orders/${order.oid}`}
                    className="text-pink-600 font-semibold hover:underline text-lg sm:text-base"
                  >
                    Order #{order.oid}
                  </Link>

                  <div className="text-gray-700 text-sm sm:text-base">
                    <p>Customer: {order.customer.name}</p>
                    <p>Phone: {order.customer.phone}</p>
                    <p>Email: {order.customer.email}</p>
                  </div>

                  <div className="text-gray-700 text-sm sm:text-base sm:text-right">
                    <p>Total: ₹{order.total}</p>
                    <p>Date: {order.order_date && order.order_date.split('T')[0]}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllOrders;
