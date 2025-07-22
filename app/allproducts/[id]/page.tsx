"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiTag, FiBox, FiLayers, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import LoadingComponent from "@/app/components/LoadingComponent";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  flavor: string;
  category: string;
  image_url: string;
  weights: Record<string, number>;
}

const ProductDetails = () => {
  const { dispatch } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        setProduct(data.product);
        setSelectedWeight(Object.keys(data.product.weights)[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        pid: product.id, 
        image_id: "", 
        isveg: true, 
        created_at: new Date(), 
        weights: {
          "500gm": product.weights["500gm"]?.toString() || "0",
          "1kg": product.weights["1kg"]?.toString() || "0",
          "2kg": product.weights["2kg"]?.toString() || "0",
          "3kg": product.weights["3kg"]?.toString() || "0",
        },
        price: product.weights[selectedWeight],
        weight: selectedWeight,
      },
    });
  };

  if (loading) {
    return <LoadingComponent loaderName="Product Details" />;
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <motion.div
          className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 text-lg mb-4">{product.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(product.weights).map(([weight, price]) => (
              <div
                key={weight}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                  selectedWeight === weight ? "border-pink-600" : "border-gray-300"
                }`}
                onClick={() => setSelectedWeight(weight)}
              >
                <span className="text-lg font-semibold text-gray-800">{weight}</span>
                <span className="text-md text-pink-600 font-bold">₹{price}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-pink-600">
              ₹{product.weights[selectedWeight] || "N/A"}
            </span>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
            >
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;