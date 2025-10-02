import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Visits counts
  const visits = await prisma.visit.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  // Monthly visit counts
  const monthlyVisits = await prisma.visit.groupBy({
    by: ["createdAt"],
    _count: { id: true },
  });

  const inquiries = await prisma.inquiry.count();

  return NextResponse.json({ visits, monthlyVisits, inquiries });
}
