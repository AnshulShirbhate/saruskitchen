import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  req: NextRequest,
   context : { params: { id: string } }
) {
  const {id} = await context.params;
  const body = await req.json();

  const { name, flavor, category, weights, isveg } = body;

  try {
    await pool.query(
      `UPDATE products 
       SET name = $1, flavor = $2, category = $3, weights = $4, isveg = $5
       WHERE id = $6`,
      [name, flavor, category, weights, isveg, id]
    );

    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
