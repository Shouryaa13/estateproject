"use client";

import { motion, Variants, easeInOut } from "framer-motion";

export default function HomePage() {
  const container: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, ease: easeInOut },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeInOut } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white overflow-hidden relative">
      {/* Subtle moving stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ y: [0, -10, 0], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-2xl w-full p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.1)] relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: easeInOut }}
      >
        {/* Floating orbs for luxury glow */}
        <motion.div
          className="absolute -top-28 -left-20 w-80 h-80 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: easeInOut }}
        />
        <motion.div
          className="absolute -bottom-28 -right-20 w-80 h-80 bg-gradient-to-r from-black to-gray-800 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: easeInOut }}
        />

        <motion.h1
          variants={item}
          initial="hidden"
          animate="show"
          className="text-5xl font-extrabold drop-shadow-xl mb-6 text-center tracking-wide bg-gradient-to-r from-gray-100 via-gray-400 to-gray-200 bg-clip-text text-transparent"
        >
          Real Estate Chatbot
        </motion.h1>

        <motion.p
          variants={item}
          initial="hidden"
          animate="show"
          className="text-center mb-10 text-lg drop-shadow-md font-medium text-white/80"
        >
          Welcome <span className="font-bold text-gray-300">Shourya</span>! Choose an option:
        </motion.p>

        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {[
            { href: "/lead", label: "✍ Lead Form (User Signup)", gradient: "from-gray-800 via-gray-700 to-gray-800" },
            { href: "/listings", label: "📋 View Listings", gradient: "from-gray-700 via-gray-600 to-gray-700" },
            { href: "/visit", label: "📅 Book a Visit", gradient: "from-gray-900 via-gray-700 to-gray-900" },
            { href: "/inquiry", label: "🔍 Property Inquiry", gradient: "from-black via-gray-800 to-black" },
          ].map((btn, i) => (
            <motion.li key={i} variants={item}>
              <motion.a
                href={btn.href}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`block w-full text-center bg-gradient-to-r ${btn.gradient} font-semibold py-4 px-8 rounded-full shadow-lg relative overflow-hidden`}
              >
                {btn.label}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}
