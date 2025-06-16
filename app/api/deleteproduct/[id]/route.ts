import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id: productId } = await context.params;

  try {
    const productResult = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    const product = productResult.rows[0];

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }
    
    const imageId = product.image_id;
    
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (cloudErr) {
      return NextResponse.json({ message: "Cloudinary Deletion Error!" }, { status: 404 });
    }

    await pool.query("DELETE FROM products WHERE id = $1", [productId]);

    return NextResponse.json({ message: "Product and image deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
