import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // const products = await pool.query(`SELECT * FROM products ORDER BY id ASC`);
    const products = await prisma.products.findMany({
      orderBy: {
        pid: 'asc',
      }
    });
    return NextResponse.json({ products: products, message: "Product added successfully." }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({message: "Error fetching products."});
  }
}
