"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function LeadPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ User created successfully!");
        toast.success("User created successfully!");
        setForm({ name: "", email: "", phone: "" });
      } else {
        const error = await res.json();
        setMessage("❌ Error: " + error.error);
        toast.error("Error: " + error.error);
      }
    } catch (err) {
      setMessage("❌ Server error, please try again later");
      toast.error("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white overflow-hidden relative">
      {/* Floating orbs */}
      <motion.div
        className="absolute -top-28 -left-20 w-80 h-80 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-28 -right-20 w-80 h-80 bg-gradient-to-r from-black to-gray-800 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-transparent"
        >
          ✍ Lead Form (User Signup)
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white placeholder-gray-400"
            required
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white placeholder-gray-400"
            required
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-white placeholder-gray-400"
            required
          />

          <motion.button
            whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              "Submit"
            )}
          </motion.button>
        </motion.form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-5 text-center font-medium text-gray-300"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}