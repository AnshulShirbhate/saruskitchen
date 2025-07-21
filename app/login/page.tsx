"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { checkIsLoggedIn, setLoggedIn } from "@/redux/userSlice";
import { checkIsAdmin, setAdmin } from "@/redux/adminSlice";


const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  useEffect(() => {
    dispatch(setLoggedIn(false));
    dispatch(setAdmin(false));
  }, []);

  const handleLogin = async () => {
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
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              className="text-pink-500 hover:underline focus:outline-none"
              onClick={() => toast.info('Password recovery is not implemented yet.')}
            >
              Forgot Password?
            </button>
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
