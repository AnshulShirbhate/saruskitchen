import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromPhone = process.env.TWILIO_PHONE_NUMBER!;
const toPhone = process.env.MY_PHONE_NUMBER!; // your phone number to receive SMS

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let message = `\nNew Cake Order 🎂\n\n`;
    for (let item of body) {
      message += `🧁 ${item.name} | ${item.weight} | Qty: ${item.quantity}\n₹${
        item.price
      } x ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
    }
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
    });
    return NextResponse.json(
      { message: "Order Placed Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
