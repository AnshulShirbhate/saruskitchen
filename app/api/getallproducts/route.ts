import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const products = await pool.query(`SELECT * FROM products ORDER BY id ASC`);
    return NextResponse.json({ products: products.rows, message: "Product added successfully." }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({message: "Error fetching products."});
  }
}
