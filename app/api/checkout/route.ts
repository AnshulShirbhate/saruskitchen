import {prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartInfo } = body;
    const customerId = Number(req.headers.get('user-id'));

    const user = await prisma.users.findUnique({
      where: {
        id: customerId,
      },
    });
    if(!user) {
      const request = NextResponse.json({message: "Login and try again!"}, {status: 400});
      request.cookies.delete('auth_token');
      return request;
    } else if (!user.isVerified) {
      throw new Error('Verify email id first!');
    }

    let message = `\nNew Cake Order From ${user.name}: ${user.phone}, Email: ${user.email} 🎂\n\n`;
    let cartTotal = 0;
    for (let item of cartInfo) {
      message += `🧁 ${item.name} | ${item.weight} | Qty: ${item.quantity}\n₹${
        item.price
      } x ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
      cartTotal += item.price * item.quantity;
    }
    message += `Total Order Value: ${cartTotal}`;

    const today = new Date();
  
    const newOrder = await prisma.orders.create({
      data: {
        customer_id: customerId,
        total: cartTotal,
        cart: JSON.stringify(cartInfo),
      }
    })


    // Sending email to the admin
     await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL,
      subject: `New Cake Order from ${user.name}`,
      text: message,
    });

    // Send email to customer
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: user.email, 
      subject: "Thank you for your order!",
      text: `\n🎉 Thank you ${user.name} for your order! We’ve received your cake order worth ₹${cartTotal}. We'll contact you within 12 hours. ❤️`,
    });


    return NextResponse.json(
      { message: "Order Placed Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error instanceof Error? error.message : "Internal Server Error!" },
      { status: 500 }
    );
  }
}
