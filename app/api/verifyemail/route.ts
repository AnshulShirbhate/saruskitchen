import jwt from 'jsonwebtoken';
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
    
    if (!token) {
        return NextResponse.json({ message: "Token is missing!" }, { status: 400 });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET!) as { userId: number };
        
    await prisma.users.update({
        where: { id: decoded.userId },
        data: { isVerified: true },
    });

    return NextResponse.json({message: "Email verified!"}, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error? error.message: "Invalid or expired token." }, { status: 400 });
  }
}
