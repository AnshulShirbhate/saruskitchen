import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    const {id} = await req.json();
    try {
        const deletedUser = await prisma.users.delete({
            where: {
                id: id
            }
        });
        return NextResponse.json({message: "User with ID: "+id+" deleted successfully!"}, {status: 200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Failed to delete user!"}, {status: 500});   
    }

}