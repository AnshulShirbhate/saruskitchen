"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { checkIsLoggedIn, setLoggedIn } from "@/redux/userSlice";
import Link from "next/link";


const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const sanitizeInput = (input: string, type: 'email' | 'password') => {
    if (type === 'email') {
      // Remove extra spaces and convert to lowercase for email
      return input.trim().toLowerCase();
    } else if (type === 'password') {
      // Remove leading/trailing spaces but preserve internal spaces for password
      return input.trim();
    }
    return input;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value, name as 'email' | 'password');
    setCredentials({ ...credentials, [name]: sanitizedValue });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (credentials.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  useEffect(() => {
    dispatch(setLoggedIn(false));
  }, []);

  const handleLogin = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        dispatch(checkIsLoggedIn());
        toast.success("Welcome! You are now logged in.", {
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
        setTimeout(()=>{
          window.location.href="/";
        }, 2000)
      } else {
        const data = await res.json();
        toast.error(data.message || "❌ Login failed");
      }
    } catch (err) {
      toast.error("⚠️ Network error");
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
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">Sign in to your account</p>
        <div className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
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
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
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
            <Link
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              // onClick={() => toast.info('Password recovery is not implemented yet.')}
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
            <span className="text-gray-400">|</span>
            <button
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition text-white shadow-lg ${
              loading
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
