import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest){
    const {token, newPassword} = await req.json();

    if (!token || !newPassword) {
        return new Response(JSON.stringify({ message: "Token and new password are required" }), { status: 400 });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET!) as { userId: number };
        // If the token is valid, update the user's password in the database
        await prisma.users.update({
            where: { id: Number(decoded.userId) },
            data: { password: bcrypt.hashSync(newPassword, 10) }
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Reset Token Expired!" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Password reset successfully!" }), { status: 200 });
}