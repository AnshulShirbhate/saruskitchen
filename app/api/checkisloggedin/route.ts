import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest){
    const token = req.cookies.get('auth_token');
    if(!token){
        return NextResponse.json({isLoggedIn: false}, {status: 200});
    }
    try {
        const decoded = await jwtVerify(token?.value, new TextEncoder().encode(process.env.JWT_SECRET!));
        const user = await prisma.users.findUnique({
            where: { id: decoded.payload.userId as number},
            omit: {
                password: true,
                createdAt: true,
            }
        })
        return NextResponse.json({isLoggedIn: true, user: user}, {status: 200});
    } catch (error) {
        return NextResponse.json({isLoggedIn: false, user: null}, {status: 200});
    }
}