import { verification } from "@/lib/emailVerification";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { email } = body;

    if (!email) {
        return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }

    const user = await prisma.users.findUnique({
        where: { email: email }
    });

    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Call the email verification function
    await verification(user.id, email, user.name, 'forgot_password');

    return new Response(JSON.stringify({ message: "Password reset email sent!" }), { status: 200 });
}