import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const { oldPassword, newPassword } = body;

    // Validate input
    if (!oldPassword || !newPassword) {
        return NextResponse.json({ message: "Old and new passwords are required" }, { status: 400 });
    }

    if(newPassword.length < 6) {
        return NextResponse.json({ message: "New password must be at least 6 characters long" }, { status: 400 });
    }

    // Check if user is authenticated
    const userId = req.headers.get("user-id");
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update password in database
    try {
        const user = await prisma.users.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}