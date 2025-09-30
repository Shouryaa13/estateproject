"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

/**
 * VisitsPage
 * - Dark/gray royal theme
 * - Charts (recharts)
 * - Demo visits (3-4) shown immediately
 * - Add demo visit button replaces "No visits found"
 */

const DEMO_VISITS = [
  {
    id: 101,
    date: new Date().toISOString(),
    status: "pending",
    property: { title: "Oceanview Apartment", location: "Bandra, Mumbai", price: 9500000 },
    user: { name: "Aman Kumar" },
    inquiry: null,
  },
  {
    id: 102,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "confirmed",
    property: { title: "Maple Villa", location: "Jaipur", price: 6500000 },
    user: { name: "Priya Sharma" },
    inquiry: { id: 11 },
  },
  {
    id: 103,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    status: "rejected",
    property: { title: "City Studio", location: "Delhi", price: 3200000 },
    user: { name: "Rahul Verma" },
    inquiry: null,
  },
  {
    id: 104,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    status: "confirmed",
    property: { title: "Sunset Plot", location: "Pune", price: 4200000 },
    user: { name: "Sana Khan" },
    inquiry: { id: 15 },
  },
];

export default function VisitsPage() {
  const [visits, setVisits] = useState(DEMO_VISITS.slice());
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 6;
  const [updatingId, setUpdatingId] = useState(null);

  // Attempt to fetch real visits, but if fails we keep demo
  useEffect(() => {
    let mounted = true;
    async function fetchVisits() {
      setLoading(true);
      try {
        const res = await fetch("/api/visit");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length) setVisits(data);
      } catch (err) {
        // keep demo data; show subtle toast
        console.info("Using demo visits — fetch failed or not available.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchVisits();
    return () => (mounted = false);
  }, []);

  // Update status (local + optimistic)
  async function updateStatus(id, status) {
    if (updatingId) return;
    setUpdatingId(id);
    try {
      // optimistic local update
      setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      // attempt API patch (if exists)
      const res = await fetch(`/api/visit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        // rollback if API fails
        toast.error("Failed to update on server. Rolling back locally.");
        // reload demo (simple rollback to pending)
        setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status: "pending" } : v)));
      } else {
        toast.success(`Visit marked ${status}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating status.");
      setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status: "pending" } : v)));
    } finally {
      setUpdatingId(null);
    }
  }

  // Add a demo visit (used when "No visits found" or for quick demo)
  function addDemoVisit() {
    const newVisit = {
      id: Math.floor(Math.random() * 9000) + 200,
      date: new Date().toISOString(),
      status: "pending",
      property: { title: "Demo Property " + Math.floor(Math.random() * 100), location: "Demo City", price: 2500000 },
      user: { name: "Demo User" },
      inquiry: null,
    };
    setVisits((p) => [newVisit, ...p]);
    toast.success("Demo visit added");
  }

  // Filtering, searching, sorting
  const filteredVisits = visits
    .filter((v) => (statusFilter ? v.status === statusFilter : true))
    .filter(
      (v) =>
        v.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.property?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sorted = filteredVisits.sort((a, b) =>
    sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / visitsPerPage));
  const paginated = sorted.slice((currentPage - 1) * visitsPerPage, (currentPage - 1) * visitsPerPage + visitsPerPage);

  // Stats & charts
  const totalVisits = visits.length;
  const pendingVisits = visits.filter((v) => v.status === "pending").length;
  const confirmedVisits = visits.filter((v) => v.status === "confirmed").length;
  const rejectedVisits = visits.filter((v) => v.status === "rejected").length;

  const COLORS = ["#C6A700", "#24A148", "#D64545"];
  const pieData = [
    { name: "Pending", value: pendingVisits },
    { name: "Confirmed", value: confirmedVisits },
    { name: "Rejected", value: rejectedVisits },
  ];

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyTrend = Array(12).fill(0);
  visits.forEach((v) => {
    const m = new Date(v.date).getMonth();
    monthlyTrend[m] = (monthlyTrend[m] || 0) + 1;
  });
  const barData = monthlyTrend.map((c, i) => ({ month: monthNames[i], visits: c }));

  // animations
  const cardAnim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <h1 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200 drop-shadow">
        Manage Visits
      </h1>

      {/* stats */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="flex flex-wrap gap-4 justify-center mb-6">
        {[ 
          { label: "Total", value: totalVisits, style: "bg-white/5" }, 
          { label: "Pending", value: pendingVisits, style: "bg-white/6" }, 
          { label: "Confirmed", value: confirmedVisits, style: "bg-white/6" }, 
          { label: "Rejected", value: rejectedVisits, style: "bg-white/6" } 
        ].map((s,i) => (
          <motion.div key={i} variants={cardAnim} className={`p-4 rounded-xl shadow border border-white/6 w-44 text-center ${s.style}`}>
            <div className="text-sm text-gray-300">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </motion.div>
        ))}

        <motion.div variants={cardAnim} className="flex items-center gap-2">
          <button onClick={() => { addDemoVisit(); setCurrentPage(1); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition shadow">
            + Add Demo Visit
          </button>
        </motion.div>
      </motion.div>

      {/* charts */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }} className="bg-white/5 p-4 rounded-lg shadow w-full md:w-1/2 h-64">
          <motion.h3 variants={cardAnim} className="text-lg font-semibold mb-2 text-center">Visit Status Distribution</motion.h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="bg-white/5 p-4 rounded-lg shadow w-full md:w-1/2 h-64">
          <motion.h3 variants={cardAnim} className="text-lg font-semibold mb-2 text-center">Monthly Visit Trend</motion.h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis allowDecimals={false} stroke="#cbd5e1"/>
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#1f2937" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* search & filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search by user or property" className="flex-1 p-3 rounded-lg bg-white/6 border border-white/6 placeholder-gray-400 outline-none" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="p-3 rounded-lg bg-white/6 border border-white/6">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-3 rounded-lg bg-white/6 border border-white/6">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* visit cards or empty state */}
      {paginated.length === 0 ? (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="p-8 bg-white/5 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">No visits found</h3>
          <p className="text-gray-300 mb-4">You can add demo visits to preview the UI or check your API connection.</p>
          <button onClick={() => addDemoVisit()} className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow">Add Demo Visit</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginated.map((visit) => (
            <motion.div key={visit.id} initial="hidden" animate="show" variants={cardAnim} className="border rounded-xl shadow-lg p-4 bg-white/6 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold">{visit.property?.title || "Untitled Property"}</h2>
                  <p className="text-sm text-gray-300">{visit.property?.location}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${visit.status === "pending" ? "bg-yellow-600 text-black" : visit.status === "confirmed" ? "bg-green-600 text-black" : "bg-red-600 text-black"}`}>
                    {visit.status}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-gray-200">Client: <span className="font-medium">{visit.user?.name || "Unknown"}</span></p>
              <p className="text-gray-300">INR {visit.property?.price?.toLocaleString?.() || visit.property?.price}</p>
              <p className="text-sm text-gray-400 mt-2">Visit: {new Date(visit.date).toLocaleString()}</p>

              {visit.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <button disabled={updatingId === visit.id} onClick={() => updateStatus(visit.id, "confirmed")} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg disabled:opacity-60"> {updatingId === visit.id ? "Updating..." : "Approve"} </button>
                  <button disabled={updatingId === visit.id} onClick={() => updateStatus(visit.id, "rejected")} className="flex-1 bg-red-500 hover:bg-red-600 text-black font-semibold py-2 rounded-lg disabled:opacity-60"> {updatingId === visit.id ? "Updating..." : "Reject"} </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 rounded ${currentPage === i+1 ? "bg-gray-700 text-white" : "bg-white/6 text-gray-200"}`}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
