'use client';

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-gray-100 p-2 rounded hover:bg-gray-200"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Toggle notifications dropdown"
      >
        🔔
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded transition-transform duration-200 scale-100 z-50">
          {notifications.length === 0 ? (
            <p className="p-2 text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 border-b last:border-b-0 ${
                  n.read ? "" : "font-bold bg-gray-50"
                }`}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
