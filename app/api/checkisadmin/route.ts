import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest){
    const token = req.cookies.get('auth_token');
    if(!token){
        return NextResponse.json({isAdmin: false}, {status: 200});
    }
    return NextResponse.json({isAdmin: true}, {status: 200});
}