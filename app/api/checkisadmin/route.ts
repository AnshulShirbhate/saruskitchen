import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const token = req.cookies.get('auth_token');
    if(!token){
        return NextResponse.json({isLoggedIn: false}, {status: 200});
    }
    try {
        const decoded = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET!));
        if(decoded.payload.role !== 'ADMIN'){
            return NextResponse.json({isAdmin: false}, {status: 200});
        }
        return NextResponse.json({isAdmin: true}, {status: 200});
    } catch (error) {
        return NextResponse.json({isAdmin: false}, {status: 200});
    }
}