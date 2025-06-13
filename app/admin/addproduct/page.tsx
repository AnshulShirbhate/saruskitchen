"use client";

import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    flavor: "",
    category: "",
    description: "",
    image: null as File | null,
    weights: {
      "500gm": "",
      "1kg": "",
      "2kg": "",
      "3kg": "",
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    weight: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [weight]: e.target.value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formDataObj = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "weights") {
        formDataObj.append("weights", JSON.stringify(value));
      } else {
        formDataObj.append(key, value as string | Blob);
      }
    });

    try {
      const response = await fetch("/api/addproduct", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        toast.success("Product Added!", {
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
        setFormData({
          name: "",
          flavor: "",
          category: "",
          description: "",
          image: null,
          weights: {
            "500gm": "",
            "1kg": "",
            "2kg": "",
            "3kg": "",
          },
        });
        setImagePreview(null);
        setModalOpen(false);
      } else {
        const err = await response.json();
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
          onClose: () => {
            router.push('/login');
          }
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong!", {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => {
            router.push('/login');
          }
        });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
  formData.name.trim() !== "" &&
  formData.flavor.trim() !== "" &&
  formData.category.trim() !== "" &&
  formData.description.trim() !== "" &&
  formData.image !== null &&
  Object.values(formData.weights).every((price) => price.trim() !== "");


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl my-20 mx-auto p-8 bg-gradient-to-br from-pink-50 to-white shadow-xl rounded-xl"
    >
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
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
        🍰 Add New Product
      </h2>

      <form className="space-y-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />

        <input
          type="text"
          name="flavor"
          value={formData.flavor}
          onChange={handleChange}
          placeholder="Flavor"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        >
          <option value="">Select Category</option>
          <option value="cakes">Cakes</option>
          <option value="pastries">Pastries</option>
          <option value="cupcakes">Cupcakes</option>
          <option value="desserts">Desserts</option>
        </select>

        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 h-32 object-cover rounded shadow"
          />
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            💰 Price by Weight
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.weights).map(([weight, value]) => (
              <div key={weight} className="flex items-center gap-2">
                <label className="w-16">{weight}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleWeightChange(e, weight)}
                  placeholder={`₹ for ${weight}`}
                  className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            ))}
          </div>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Description"
          required
          className="w-full p-3 h-24 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg transition hover:bg-pink-600"
          disabled={!isFormValid}
        >
          Add Product
        </motion.button>
        {!isFormValid && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please fill out all fields and upload an image to continue.
  </p>
)}
      </form>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
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
                Are you sure you want to add this product?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddProductForm;
