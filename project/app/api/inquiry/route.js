import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST inquiry (create new)
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    const missingFields = [];
    if (!body.userId) missingFields.push("userId");
    if (!body.propertyId) missingFields.push("propertyId");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate budget if provided
    let budget = null;
    if (body.budget !== undefined && body.budget !== null) {
      budget = parseInt(body.budget);
      if (isNaN(budget) || budget < 0) {
        return NextResponse.json(
          { error: "Budget must be a positive integer" },
          { status: 400 }
        );
      }
    }

    const newInquiry = await prisma.inquiry.create({
      data: {
        budget: budget,
        location: body.location || null,
        propertyType: body.propertyType || null,
        user: { connect: { id: body.userId } },
        property: { connect: { id: body.propertyId } },
      },
    });

    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry", details: error.message },
      { status: 500 }
    );
  }
}
