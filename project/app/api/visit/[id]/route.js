import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status, visitDate } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Update the inquiry status with related property and user
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: Number(id) },
      data: { status },
      include: { property: true, user: true },
    });

    let newVisit = null;

    // If inquiry is approved, create a new visit record with status "pending"
    if (status === "approved") {
      newVisit = await prisma.visit.create({
        data: {
          inquiry: { connect: { id: Number(id) } },
          date: visitDate ? new Date(visitDate) : new Date(),
          status: "pending",
        },
        include: { property: true, user: true, inquiry: true },
      });
    }

    return NextResponse.json({ updatedInquiry, newVisit });
  } catch (error) {
    console.error("PATCH /inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry", details: error.message },
      { status: 500 }
    );
  }
}
