import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const productId = Number(pathname.split("/").pop());

  if (!productId || isNaN(productId)) {
    return NextResponse.json({ error: "Product ID is required and must be a number" }, { status: 400 });
  }

  try {
    const product = await prisma.products.findUnique({
      where: {
        pid: productId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
  }
}