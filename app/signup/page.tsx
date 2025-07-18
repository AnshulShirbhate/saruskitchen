"use client";

import { useEffect, useState } from "react";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Account created! You can now log in.", {
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
        router.push("/login");
      } else {
        const err = await res.text();
        toast.error(err || "❌ Signup failed");
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
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Sign up to get started</p>
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50 text-gray-700"
            required
          />
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
