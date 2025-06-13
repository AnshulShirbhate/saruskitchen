import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Replace with a strong secret in production

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const validAdmin = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;

  if (!validAdmin) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const payload = {
    uid: "admin-uid-123", 
    role: "admin",
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

(await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
