import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context : { params: { id: string } }) {
    try {
        
        const { id } = await context.params;
        
        const product = await prisma.products.findUnique({
        where: {
            pid: Number(id)
        }
        })
    if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({product: product}, { status: 200 });
} catch (error) {
        return NextResponse.json({message: error instanceof Error? error.message : "Internal Server Error!"}, { status: 500});
        
    }
}