import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from '@/lib/cloudinary';

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: productId } = await context.params;

  try {
    const product = await prisma.products.findUnique({
      where: {
        pid: Number(productId)
      }
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }
    
    const imageId = product.image_id;
    
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (cloudErr) {
      return NextResponse.json({ message: "Cloudinary Deletion Error!" }, { status: 404 });
    }

    await prisma.products.delete({
      where: {
        pid: Number(productId)
      }
    })

    return NextResponse.json({ message: "Product and image deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
