import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
   context : { params: { id: string } }
) {
  const {id} = await context.params;
  const body = await req.json();

  const { name, flavor, category, weights, isveg } = body;

  try {
    await prisma.products.update({
      where: {pid: Number(id)},
      data: {
        name,
        flavor,
        category,
        weights,
        isveg
      }
    })

    return NextResponse.json({ message: "Product updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
