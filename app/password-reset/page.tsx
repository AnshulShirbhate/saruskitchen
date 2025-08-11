"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const PasswordResetPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Invalid or missing reset token");
      router.push("/login");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setPasswords({ ...passwords, [name]: trimmedValue });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    // New password validation
    if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password should be at least 6 characters long";
    }

    // Confirm password validation
    if (passwords.confirmPassword !== passwords.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/resetpassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: passwords.newPassword 
        }),
      });

      if (res.status === 200) {
        toast.success("Password reset successfully! Redirecting to login...", {
          position: "bottom-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-red-200 p-4">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-red-50 to-red-200 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-full max-w-md border border-red-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiLock className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-red-500 mb-2 tracking-tight">
            Reset Password
          </h2>
          <p className="text-gray-500">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter your new password"
                value={passwords.newPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 pr-12 ${
                  errors.newPassword 
                    ? "border-red-500 focus:ring-red-400" 
                    : "border-gray-200 focus:ring-red-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.newPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Password should be at least 6 characters long</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 block mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 text-gray-700 pr-12 ${
                  errors.confirmPassword 
                    ? "border-red-500 focus:ring-red-400" 
                    : "border-gray-200 focus:ring-red-400"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition text-white shadow-lg ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-red-500 hover:underline focus:outline-none"
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

export default PasswordResetPage;