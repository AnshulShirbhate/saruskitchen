import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma} from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verification } from "@/lib/emailVerification";


const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, password } = body;
  if(name.length <= 1) {
    return NextResponse.json({ message: "Name must be at least 2 characters long" }, { status: 400 });
  } else if (email.length <= 5 || !email.includes("@")) {
    return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
  } else if (phone.length != 10) {
    return NextResponse.json({ message: "Phone number must be exactly 10 digits long" }, { status: 400 });
  } else if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.users.findUnique({
    where : {
      email: email
    }
  })
  if(existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const newUser = await prisma.users.create({
    data: {
      name: name,
      email:email,
      phone: phone,
      password: hashedPassword
    }
  })

  const payload = {
    userId: newUser.id, 
    role: newUser.role,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

  // Sending email verification link to the user.
  await verification(newUser.id, newUser.email, newUser.name, 'verification');


  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "Verification email sent !" }, { status: 200 });
}
