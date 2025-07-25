import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse){
    try {
        const customerId = Number(req.headers.get('user-id'));
        const orders = await prisma.orders.findMany({
            where: {
                customer_id: customerId as number
            },
            include: {
                customer: {
                    select: {
                        name: true,
                        phone: true,
                        email: true
                    }
                }
            },
            orderBy: {
                order_date: 'desc'
            }
        });
        return NextResponse.json({message: "Data fetched successfully!", orders: orders}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error!"}, {status: 500});
    }
}