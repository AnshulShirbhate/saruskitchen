import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest){
    const body = await req.json();
    try {
        const updatedUser = await prisma.users.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                role: body.role,    
                isVerified: body.isVerified
            }
        })
        return NextResponse.json({message: "Updated User Successfully!"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Failed to update user!"}, {status: 500});
    }
}