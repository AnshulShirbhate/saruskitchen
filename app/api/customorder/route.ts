import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const instruction = formData.get("instruction") as string;
    const image = formData.get("image") as File;

    const customerId = Number(req.headers.get("user-id"));

    const user = await prisma.users.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }


    if (!user.isVerified) {
      return NextResponse.json({
        message: "Please verify your email Id to place a custom order."
      }, { status: 403 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "saruskitchen/customorders",
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
    let message = `🎂 New Custom Cake Order 🎂\n👤 Name: ${user.name}\n📞 Phone: ${user.phone}\n📧 Email: ${user.email}\n📝 Instructions: ${instruction} 🖼️ Image: ${uploadResult.secure_url}`;


    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL,
      subject: `New Cake Order from ${user.name}`,
      text: message,
    });

    let usermessage = `🎉 Thank you, ${user.name}!\nWe've received your custom cake order request 🎂\n📋 Our team will review your instructions and get in touch with you within 12 hours.\n❤️ We appreciate your trust in Saru's Kitchen!\n– Saru’s Kitchen Team`;

    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: user.email,
      subject: `Custom Cake Order Received (Saru's Kitchen)`,
      text: usermessage,
    });



    return NextResponse.json(
      { message: "Request Submitted Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
