import { verification } from "@/lib/emailVerification";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const userId = Number(req.headers.get('user-id'));

    try {
        
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        });
        if(!user){
            throw new Error('User not found!');
        }

        if(user.isVerified) {
            throw new Error('User already verified!');
        }
        
        await verification(user.id, user.email, user?.name, "verification");
        
        return NextResponse.json({message: "Email verification link sent!"});
    } catch (error) {
        return NextResponse.json({message: error instanceof Error? error.message :"Internal Server Error!"}, {status: 400});
    }
}