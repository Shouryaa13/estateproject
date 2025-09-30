"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleSave = async () => {
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <label className="block mb-2">Name:</label>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border p-2 mb-4 w-full"
      />
      <label className="block mb-2">Email:</label>
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="border p-2 mb-4 w-full"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}
