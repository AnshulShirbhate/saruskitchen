import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import cloudinary from "@/lib/cloudinary";
import pool from "@/lib/db";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;
const toPhone = process.env.MY_PHONE_NUMBER!; // your phone number to receive SMS

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const instruction = formData.get("instruction") as string;
    const image = formData.get("image") as File;
    if(phone.length!=10){
        throw new Error('Invalid Phone Number!');
    }

    if (image) {
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
      

      await pool.query(
        `INSERT INTO customorders (name, email, phone, instructions, image_url, image_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          name,
          email,
          phone,
          instruction,
          uploadResult.secure_url,
          uploadResult.public_id,
        ]
      );

    } else {
        await pool.query(
        `INSERT INTO customorders (name, email, phone, instructions)
       VALUES ($1, $2, $3, $4)`,
        [
          name,
          email,
          phone,
          instruction
        ]
      );
    }
    let message = `New Custom Order\nFrom: ${name}\nPhone: ${phone}\nEmail: ${email}\nInstructions: ${instruction}`;

    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
    });

    return NextResponse.json(
      { message: "Request Submitted Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal Server Error'},
      { status: 500 }
    );
  }
}
