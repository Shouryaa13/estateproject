"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

/**
 * DashboardPage
 * - Create / list inquiries (demo data included)
 * - Linked visits shown under visits (demo)
 * - Approve / reject both inquiries & visits
 * - Dark/gray royal theme consistent with VisitsPage
 */

const DEMO_INQUIRIES = [
  {
    id: 11,
    name: "Aman Kumar",
    phone: "9876543210",
    budget: 9000000,
    location: "Bandra",
    propertyType: "flat",
    status: "pending",
    property: { title: "Oceanview Apartment", location: "Bandra" },
  },
  {
    id: 12,
    name: "Priya Sharma",
    phone: "9123456780",
    budget: 7000000,
    location: "Jaipur",
    propertyType: "villa",
    status: "approved",
    property: { title: "Maple Villa", location: "Amer" },
  },
  {
    id: 13,
    name: "Rahul Verma",
    phone: "9998887776",
    budget: 3500000,
    location: "Delhi",
    propertyType: "studio",
    status: "rejected",
    property: { title: "City Studio", location: "Connaught Place" },
  },
];

const DEMO_VISITS = [
  {
    id: 201,
    date: new Date().toISOString(),
    status: "pending",
    property: { title: "Oceanview Apartment", location: "Bandra", price: 9500000 },
    user: { name: "Aman Kumar" },
    inquiry: { id: 11 },
  },
  {
    id: 202,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: "confirmed",
    property: { title: "Maple Villa", location: "Jaipur", price: 6500000 },
    user: { name: "Priya Sharma" },
    inquiry: { id: 12 },
  },
  {
    id: 203,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "rejected",
    property: { title: "City Studio", location: "Delhi", price: 3200000 },
    user: { name: "Rahul Verma" },
    inquiry: { id: 13 },
  },
];

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState(DEMO_INQUIRIES.slice());
  const [visits, setVisits] = useState(DEMO_VISITS.slice());
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", budget: "", location: "", propertyType: "", propertyId: "" });
  const [updatingInquiryId, setUpdatingInquiryId] = useState(null);
  const [updatingVisitId, setUpdatingVisitId] = useState(null);
  const [visitFilters, setVisitFilters] = useState({ status: "", inquiryId: "" });

  useEffect(() => {
    // try to fetch remote, otherwise demo remains
    (async function tryFetch() {
      setLoadingInquiries(true);
      setLoadingVisits(true);
      try {
        const iq = await fetch("/api/inquiry").then((r) => (r.ok ? r.json() : []));
        if (Array.isArray(iq) && iq.length) setInquiries(iq);
      } catch (e) {}
      setLoadingInquiries(false);

      try {
        const vs = await fetch("/api/visit").then((r) => (r.ok ? r.json() : []));
        if (Array.isArray(vs) && vs.length) setVisits(vs);
      } catch (e) {}
      setLoadingVisits(false);
    })();
  }, []);

  async function handleSubmitInquiry(e) {
    e.preventDefault();
    // local create (demo)
    const id = Math.floor(Math.random() * 9000) + 500;
    const newInq = { ...form, id, status: "pending", property: { title: form.propertyType || "Unknown" } };
    setInquiries((p) => [newInq, ...p]);
    setForm({ name: "", phone: "", budget: "", location: "", propertyType: "", propertyId: "" });
    toast.success("Inquiry created (demo)");
    // try API create if available
    try {
      await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newInq) });
    } catch (err) {}
  }

  async function updateInquiryStatus(id, status) {
    if (updatingInquiryId) return;
    setUpdatingInquiryId(id);
    try {
      setInquiries((p) => p.map((iq) => (iq.id === id ? { ...iq, status } : iq)));
      toast.success(`Inquiry marked ${status}`);
      // try API
      await fetch(`/api/inquiry/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    } catch (e) {
      toast.error("Failed to update inquiry on server");
    } finally {
      setUpdatingInquiryId(null);
    }
  }

  async function updateVisitStatus(id, status) {
    if (updatingVisitId) return;
    setUpdatingVisitId(id);
    try {
      setVisits((p) => p.map((v) => (v.id === id ? { ...v, status } : v)));
      toast.success(`Visit marked ${status}`);
      await fetch(`/api/visit/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    } catch (e) {
      toast.error("Failed to update visit on server");
    } finally {
      setUpdatingVisitId(null);
    }
  }

  // filter visits by status / inquiry
  const filteredVisits = visits.filter((v) => (visitFilters.status ? v.status === visitFilters.status : true) && (visitFilters.inquiryId ? v.inquiry?.id === Number(visitFilters.inquiryId) : true));

  const cardAnim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <h1 className="text-3xl font-extrabold text-center">Admin Dashboard</h1>

      {/* Create Inquiry */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="border p-5 rounded-xl shadow bg-white/6">
        <motion.h2 variants={cardAnim} className="font-bold mb-4 text-lg">Create New Inquiry</motion.h2>
        <motion.form onSubmit={handleSubmitInquiry} variants={cardAnim} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Name" className="p-3 rounded bg-white/6 border border-white/6"/>
          <input required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="Phone" className="p-3 rounded bg-white/6 border border-white/6"/>
          <input required value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} placeholder="Budget" className="p-3 rounded bg-white/6 border border-white/6"/>
          <input required value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Location" className="p-3 rounded bg-white/6 border border-white/6"/>
          <select required value={form.propertyType} onChange={(e) => setForm({...form, propertyType: e.target.value})} className="p-3 rounded bg-white/6 border border-white/6">
            <option value="">Select Property Type</option>
            <option value="flat">Flat</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
          </select>
          <input value={form.propertyId} onChange={(e) => setForm({...form, propertyId: e.target.value})} placeholder="Property ID (optional)" className="p-3 rounded bg-white/6 border border-white/6"/>
          <button type="submit" className="md:col-span-2 bg-gradient-to-r from-gray-700 to-gray-600 py-3 rounded font-semibold mt-2 hover:from-gray-600">Submit Inquiry</button>
        </motion.form>
      </motion.div>

      {/* Inquiries list */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl">Inquiries</h2>
        {loadingInquiries ? (
          <p>Loading inquiries...</p>
        ) : inquiries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inquiries.map((inq) => (
              <motion.div key={inq.id} initial="hidden" animate="show" variants={cardAnim} className="border p-4 rounded-xl shadow bg-white/6">
                <h3 className="font-bold">{inq.property?.title || "Untitled Property"}</h3>
                <p>Location: {inq.location || inq.property?.location}</p>
                <p>Budget: {inq.budget}</p>
                <p>Type: {inq.propertyType}</p>
                <p>Contact: {inq.user?.name || inq.name} - {inq.user?.phone || inq.phone}</p>
                <p className={`mb-2 font-medium ${inq.status === "pending" ? "text-yellow-500" : inq.status === "approved" ? "text-green-400" : "text-red-400"}`}>Status: {inq.status}</p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {inq.status === "pending" && (
                    <>
                      <button disabled={updatingInquiryId === inq.id} onClick={() => updateInquiryStatus(inq.id, "approved")} className="flex-1 bg-green-500 hover:bg-green-600 text-black py-2 rounded disabled:opacity-60">{updatingInquiryId === inq.id ? "Updating..." : "Approve"}</button>
                      <button disabled={updatingInquiryId === inq.id} onClick={() => updateInquiryStatus(inq.id, "rejected")} className="flex-1 bg-red-500 hover:bg-red-600 text-black py-2 rounded disabled:opacity-60">{updatingInquiryId === inq.id ? "Updating..." : "Reject"}</button>
                    </>
                  )}
                  {inq.status === "approved" && (
                    <button onClick={() => { setVisitFilters({ ...visitFilters, inquiryId: String(inq.id), status: "" }); toast.success("Showing linked visits"); }} className="flex-1 bg-blue-500 hover:bg-blue-600 text-black py-2 rounded">View Linked Visit(s)</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p>No inquiries found. Create one above to start.</p>
        )}
      </div>

      {/* Visit filters */}
      <div className="flex gap-4 flex-wrap items-end mt-2">
        <select value={visitFilters.status} onChange={(e) => setVisitFilters({...visitFilters, status: e.target.value})} className="p-2 rounded bg-white/6">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={visitFilters.inquiryId} onChange={(e) => setVisitFilters({...visitFilters, inquiryId: e.target.value})} className="p-2 rounded bg-white/6">
          <option value="">All Inquiries</option>
          {inquiries.map((inq) => <option key={inq.id} value={inq.id}>#{inq.id} - {inq.name || inq.property?.title}</option>)}
        </select>

        <button onClick={() => { /* refresh */ toast.success("Refreshed (demo)"); }} className="bg-blue-600 text-black px-4 py-2 rounded">Apply Filters</button>
      </div>

      {/* Visits list */}
      <div className="space-y-4 mt-4">
        <h2 className="font-bold text-xl">Visits</h2>
        {loadingVisits ? (
          <p>Loading visits...</p>
        ) : filteredVisits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredVisits.map((visit) => (
              <motion.div key={visit.id} initial="hidden" animate="show" variants={cardAnim} className="border rounded-xl shadow-lg p-5 bg-white/6 hover:shadow-xl transition">
                <h3 className="text-lg font-semibold">{visit.property?.title || "Untitled"}</h3>
                <p>Location: {visit.property?.location || "Unknown"}</p>
                <p>Price: INR {visit.property?.price?.toLocaleString?.() || visit.property?.price}</p>
                <p>Client: {visit.user?.name || visit.inquiry?.name}</p>
                {visit.inquiry && <p className="text-sm text-blue-300">From Inquiry #{visit.inquiry.id}</p>}
                <p className={`mb-2 font-medium ${visit.status === "pending" ? "text-yellow-500" : visit.status === "confirmed" ? "text-green-400" : "text-red-400"}`}>Status: {visit.status}</p>

                {visit.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button disabled={updatingVisitId === visit.id} onClick={() => updateVisitStatus(visit.id, "confirmed")} className="flex-1 bg-green-500 hover:bg-green-600 text-black py-2 rounded disabled:opacity-60">{updatingVisitId === visit.id ? "Updating..." : "Approve"}</button>
                    <button disabled={updatingVisitId === visit.id} onClick={() => updateVisitStatus(visit.id, "rejected")} className="flex-1 bg-red-500 hover:bg-red-600 text-black py-2 rounded disabled:opacity-60">{updatingVisitId === visit.id ? "Updating..." : "Reject"}</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="p-6 bg-white/5 rounded text-center">
            <p className="mb-3">No visits found.</p>
            <button onClick={() => {
              // add demo visit
              const newV = {
                id: Math.floor(Math.random()*9000)+300,
                date: new Date().toISOString(),
                status: "pending",
                property: { title: "Quick Demo Property", location: "Demo", price: 2500000 },
                user: { name: "Quick Demo" },
                inquiry: null,
              };
              setVisits((p)=>[newV, ...p]);
              toast.success("Demo visit added");
            }} className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded">Add Demo Visit</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
