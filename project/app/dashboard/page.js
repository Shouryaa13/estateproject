"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return router.push("/login");
    if (session?.user?.role !== "admin") return router.push("/login");
    setLoading(false);
  }, [session, status, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="mb-6">Welcome, {session?.user?.name}!</p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
