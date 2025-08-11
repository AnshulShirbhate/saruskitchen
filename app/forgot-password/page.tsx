"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });

  const sanitizeEmail = (input: string) => {
    return input.trim().toLowerCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeEmail(e.target.value);
    setEmail(sanitizedValue);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ email: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/forgotpasswordemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Password reset link sent to your email!", {
          position: "bottom-center",
          autoClose: 3000,
        });
        // Optionally redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send reset email");
      }
    } catch (err) {
      toast.error("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-blue-100">
        {/* Back button */}
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-6 transition-colors"
        >
          <FiArrowLeft />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiMail className="text-blue-500 text-2xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-blue-500 mb-2 tracking-tight">
            Forgot Password?
          </h2>
          <p className="text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 ${
                errors.email 
                  ? "border-red-500 focus:ring-red-400" 
                  : "border-gray-200 focus:ring-blue-400"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition text-white shadow-lg ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;