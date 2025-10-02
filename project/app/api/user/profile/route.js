import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";

// GET user profile
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return NextResponse.json(user);
}

// Update profile details (name, email)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Optional: Add validation of name/email format here

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return NextResponse.json(updatedUser);
}

// Update password
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { oldPassword, newPassword } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

  return NextResponse.json({ message: "Password updated" });
}
