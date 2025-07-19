import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma} from '@/lib/prisma';
import bcrypt from 'bcrypt';

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, password } = body;

  
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

(await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "Registration Successfull!" }, { status: 200 });
}
