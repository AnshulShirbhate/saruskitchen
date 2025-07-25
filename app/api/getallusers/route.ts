import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){
    try {
        const users = await prisma.users.findMany({
            omit: {
                password: true
            },
            orderBy: {
                id: 'desc'
            }
        })
        return NextResponse.json({users: users}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error instanceof Error? error.message: "Internal Server Error!"}, {status: 500});
    }
}