import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse){
    try {
        const orders = await pool.query(`SELECT * FROM ORDERS ORDER BY order_id ASC;`);
        return NextResponse.json({message: "Data fetched successfully!", data: orders.rows}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error!"}, {status: 500});
    }
}