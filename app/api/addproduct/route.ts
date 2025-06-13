import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {

  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  try {

    if (!token) throw new Error("No token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const flavor = formData.get("flavor") as string;
    const category = formData.get("category") as string;
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

    await pool.query(
      `INSERT INTO products (name, flavor, category, image_url, image_id, weights, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        name,
        flavor,
        category,
        uploadResult.secure_url,
        uploadResult.public_id,
        weights,
        description,
      ]
    );

    return NextResponse.json({ message: "Product added successfully." }, { status: 200 });
  } catch (err) {
    console.log(err)
    const response = NextResponse.json({message: "Unauthorized"}, {status: 401});
    response.cookies.delete('auth_token');
    return response;
  }
}
