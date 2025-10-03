import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // ensures fresh data on every call

// POST - Create new listing
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, imageUrl, price, location, description } = body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!price) missingFields.push("price");
    if (!location) missingFields.push("location");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate price as a positive number
    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: { title, imageUrl, price, location, description: description || null },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get all listings
export async function GET() {
  try {
    const listings = await prisma.listing.findMany();
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings", details: error.message },
      { status: 500 }
    );
  }
}
