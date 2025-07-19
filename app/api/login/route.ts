import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await prisma.users.findUnique({
    where: {
      email: body.email
    }
  });
  if(!user) {
    return NextResponse.json({message: "Email or Password is incorrect!"}, {status: 400});
  }
  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if(isPasswordValid === false) {
    return NextResponse.json({message: "Email or Password is incorrect!"}, {status: 400});
  }

  const {password, ...userWithoutPassword} = user;

  const payload = {
    userId: user.id, 
    role: user.role,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

(await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "Login successful", user: userWithoutPassword }, { status: 200 });
}
