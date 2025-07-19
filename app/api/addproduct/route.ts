import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {


  try {


    const formData = await req.formData();

    const name = formData.get("name") as string;
    const flavor = formData.get("flavor") as string;
    const category = formData.get("category") as string;
    const isveg = formData.get("isveg") as string;
    const isVeg = isveg === "true";
    const description = formData.get("description") as string;
    const weights = JSON.parse(formData.get("weights") as string);
    const image = formData.get("image") as File;

    if (!image || !image.name) {
      return NextResponse.json({ error: "No image uploaded." }, { status: 400 });
    }


    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "saruskitchen/products",
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    await prisma.products.create({
      data: {
        name,
        flavor,
        category,
        image_url: uploadResult.secure_url,
        image_id: uploadResult.public_id,
        weights,
        description,
        isveg: isVeg
      }
    });

    return NextResponse.json({ message: "Product added successfully." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({message: "Server Error"}, {status: 500});
  }
}
