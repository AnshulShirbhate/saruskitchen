import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const orders = await prisma.orders.findMany({
            include:{
                customer: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                },
            },
            orderBy: {
                order_date: 'desc'
            }
        });
        return NextResponse.json({orders: orders, message: "Successfully retrived the orders!"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Failed to fetch the orders!"}, {status: 500});
        
    }
}