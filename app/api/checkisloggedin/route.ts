import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export function GET(req: NextRequest){
    const token = req.cookies.get('auth_token');
    if(!token){
        return NextResponse.json({isLoggedIn: false}, {status: 200});
    }
    try {
        const decoded = jwtVerify(token?.value, new TextEncoder().encode(process.env.JWT_SECRET!));
        return NextResponse.json({isLoggedIn: true}, {status: 200});
    } catch (error) {
        return NextResponse.json({isLoggedIn: false}, {status: 200});
    }
}