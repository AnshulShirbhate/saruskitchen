"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";



const SignupPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
    };

    // Name validation
    if (form.name.trim().length < 2) {
      newErrors.name = "Name should be at least 2 characters long";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone number should be exactly 10 digits";
    }

    // Password validation
    if (form.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };



  const handleSignup = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => {
          window.location.href="/";
        }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err instanceof Error? err.message :"⚠️ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-pink-50 to-pink-200 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-pink-100">
        <h2 className="text-4xl font-extrabold text-pink-500 text-center mb-6 tracking-tight">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Sign up to get started</p>
        <div className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 ${
                errors.name 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-200 focus:ring-pink-400"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 ${
                errors.email 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-200 focus:ring-pink-400"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 ${
                errors.phone 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-200 focus:ring-pink-400"
              }`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 ${
                errors.password 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-200 focus:ring-pink-400"
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Already have an account?</span>
            <button
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => router.push('/login')}
            >
              Login
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition text-white shadow-lg ${
              loading
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;
