'use client';

import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateVisit() {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !date) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date, status }),
      });

      if (!res.ok) throw new Error("Failed to create visit");
      const newVisit = await res.json();
      toast.success("Visit created successfully");

      // Clear form
      setUserId("");
      setDate("");
      setStatus("pending");
    } catch (err) {
      toast.error(err.message || "Error creating visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Visit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Creating..." : "Create Visit"}
        </button>
      </form>
    </div>
  );
}
