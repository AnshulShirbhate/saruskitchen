"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import ProductInterface from "./ProductInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { Bounce, toast } from "react-toastify";
import { fetchProducts } from "@/redux/productSlice";
import Link from "next/link";

interface ProductCardProps {
  product: ProductInterface;
}

const weightOptions = ["500gm", "1kg", "2kg", "3kg"] as const;

export default function ProductCard({ product }: ProductCardProps) {
  const dispatchRedux = useDispatch<AppDispatch>();
  const { dispatch } = useCart();
  const isAdmin = useSelector((state: RootState) => state.admin.isAdmin);
  const [selectedWeight, setSelectedWeight] =
    useState<keyof typeof product.weights>("500gm");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product.name,
    flavor: product.flavor,
    category: product.category,
    weights: product.weights,
    isveg: product.isveg,
  });
  const [editing, setEditing] = useState(false);


  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        ...product,
        price: Number(product.weights[selectedWeight]),
        weight: selectedWeight
      },
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/deleteproduct/${product.pid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
         toast.success("Successfully Deleted The Product!", {
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
        dispatchRedux(fetchProducts());
      } else {
        throw new Error(data.message);
      }
    } catch (err:any) {
       toast.error(err.message, {
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
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditChange = (field: string, value: any) => {
  setEditForm((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleEditSubmit = async () => {
  setEditing(true);
  try {
    const res = await fetch(`/api/editproduct/${product.pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Product updated successfully!", {
        position: "bottom-center",
        autoClose: 2000,
        transition: Bounce,
      });
      dispatchRedux(fetchProducts());
      setShowEditModal(false);
    } else {
      throw new Error(data.message);
    }
  } catch (err: any) {
    toast.error(err.message, {
      position: "bottom-center",
      autoClose: 2000,
      transition: Bounce,
    });
  } finally {
    setEditing(false);
  }
};


  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Link href={'/allproducts/'+product.pid}>
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            />
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                product.isveg
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}
            >
              {product.isveg ? "Veg" : "Non-Veg"}
            </span>
          </div>
            </Link>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">Flavor: {product.flavor}</p>
          <p className="text-sm text-gray-600 mb-3">
            Category: {product.category}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {weightOptions.map((weight) => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                disabled={!product.weights[weight]}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedWeight === weight
                    ? "bg-pink-600 text-white border-pink-600"
                    : "text-gray-700 border-gray-300"
                } ${!product.weights[weight] && "opacity-50 cursor-not-allowed"}`}
              >
                {weight}
              </button>
            ))}
          </div>

          <div className="flex items-center flex-wrap justify-between">
            <span className="text-xl font-bold text-pink-600">
              ₹{product.weights[selectedWeight] || "N/A"}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-pink-600 hover:bg-pink-700"
              disabled={!product.weights[selectedWeight]}
            >
              Add to Cart
            </Button>
          </div>

          {isAdmin && (
            <div className="mt-2 flex items-center justify-between">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowEditModal(true)}>
                Edit Product
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Product
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <p className="text-lg mb-6 text-gray-700">
                Are you sure you want to delete <b>{product.name}</b>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition ${
                    deleting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showEditModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">Edit Product</h2>

        <div className="space-y-3">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => handleEditChange("name", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
          />
          <input
            type="text"
            value={editForm.flavor}
            onChange={(e) => handleEditChange("flavor", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Flavor"
          />
          <input
            type="text"
            value={editForm.category}
            onChange={(e) => handleEditChange("category", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Category"
          />
          <div className="flex flex-col space-y-1">
            {Object.keys(editForm.weights).map((w) => (
              <input
                key={w}
                type="number"
                value={editForm.weights[w as keyof typeof product.weights] || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    weights: {
                      ...prev.weights,
                      [w]: Number(e.target.value),
                    },
                  }))
                }
                className="w-full border rounded px-3 py-2"
                placeholder={`${w} Price`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="text-sm">Is Veg?</label>
            <input
              type="checkbox"
              checked={editForm.isveg}
              onChange={(e) => handleEditChange("isveg", e.target.checked)}
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleEditSubmit}
              disabled={editing}
              className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 ${
                editing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {editing ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-6 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
