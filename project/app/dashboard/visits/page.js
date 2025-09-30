'use client';

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVisit, setEditingVisit] = useState(null); // Visit being edited
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Fetch visits from API
  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/visit");
      const data = await res.json();
      setVisits(data);
    } catch (err) {
      toast.error("Failed to fetch visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // Delete visit handler
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/visit/${id}`, { method: "DELETE" });
      toast.success("Visit deleted");
      setVisits(visits.filter((v) => v.id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Open edit modal
  const openEditModal = (visit) => {
    setEditingVisit(visit);
    setEditDate(new Date(visit.date).toISOString().split("T")[0]);
    setEditStatus(visit.status);
  };

  // Save visit edits
  const handleEditSave = async () => {
    try {
      const res = await fetch(`/api/visit/${editingVisit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: editDate, status: editStatus }),
      });
      const updatedVisit = await res.json();

      setVisits(visits.map((v) => (v.id === updatedVisit.id ? updatedVisit : v)));
      toast.success("Visit updated");
      setEditingVisit(null);
    } catch {
      toast.error("Failed to update visit");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Visits</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.user?.name || "User"}</td>
              <td>{new Date(visit.date).toLocaleDateString()}</td>
              <td>{visit.status}</td>
              <td className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => openEditModal(visit)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(visit.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Visit</h2>
            <label className="block mb-2">Date:</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <label className="block mb-2">Status:</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="border p-2 mb-4 w-full"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditingVisit(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
