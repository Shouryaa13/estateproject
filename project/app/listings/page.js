"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings");
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();

        if (data.length === 0) {
          // Demo data if API returns empty
          setProperties([
            {
              id: 1,
              title: "🏡 Luxury Villa",
              location: "Jaipur",
              price: "85,00,000",
              imageUrl: "/villa.png",
            },
            {
              id: 2,
              title: "🏢 Modern Apartment",
              location: "Udaipur",
              price: "45,00,000",
              imageUrl: "/apartment.png",
            },
            {
              id: 3,
              title: "🌴 Farmhouse Retreat",
              location: "Jodhpur",
              price: "1,20,00,000",
              imageUrl: "/farmhouse.png",
            },
            {
              id: 4,
              title: "🏖 Beach House",
              location: "Goa",
              price: "2,50,00,000",
              imageUrl: "/beachhouse.png",
            },
          ]);
        } else {
          setProperties(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  async function handleBooking(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedProperty?.id,
          date,
          userId: 1,
        }),
      });

      if (res.ok) {
        alert("✅ Visit booked successfully!");
        setShowForm(false);
        setDate("");
      } else {
        const error = await res.json();
        alert("❌ Failed to book visit: " + error.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠ Error booking visit");
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-400 animate-pulse">
        Loading listings...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center text-white mb-10"
      >
        Available Properties
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {properties.map((property) => (
          <motion.div
            key={property.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden"
          >
            <img
              src={property.imageUrl || "/placeholder.png"}
              alt={property.title || "Property Image"}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-white mb-2">
                {property.title}
              </h2>
              <p className="text-gray-300 mb-1">
                📍 {property.location || "Unknown"}
              </p>
              <p className="text-green-400 font-bold mb-4">
                💰 INR {property.price || 0}
              </p>
              <button
                onClick={() => {
                  setSelectedProperty(property);
                  setShowForm(true);
                }}
                className="w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white py-2 rounded-lg transition font-semibold shadow-md"
              >
                Book Visit
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {showForm && selectedProperty && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 text-white p-6 rounded-2xl w-96 shadow-2xl border border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-4">
              Book Visit: {selectedProperty.title}
            </h2>
            <form onSubmit={handleBooking}>
              <label className="block mb-2 font-medium">Select Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="border border-gray-600 bg-gray-800 rounded p-2 w-full mb-4 text-white"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
