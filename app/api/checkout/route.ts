import pool from "@/lib/db";
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
    const { cartInfo } = body;
    const { customerPhone, customerName } = body.customerInfo;

    let message = `\nNew Cake Order From ${customerName}: ${customerPhone} 🎂\n\n`;
    let cartTotal = 0;
    for (let item of cartInfo) {
      message += `🧁 ${item.name} | ${item.weight} | Qty: ${item.quantity}\n₹${
        item.price
      } x ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
      cartTotal += item.price * item.quantity;
    }
    message += `Total Order Value: ${cartTotal}`;
    // console.log(cartInfo);
    // Query to store the order information in the database.
    //     CREATE TABLE ORDERS(
          // 	order_id SERIAL PRIMARY KEY,
          // 	customer_name TEXT NOT NULL,
          // 	customer_phone TEXT NOT NULL,
          // 	customer_email TEXT,
          // 	instructions TEXT,
          // 	cart JSON,
          // 	total NUMERIC,
        // );
    await pool.query(
      `INSERT INTO ORDERS(customer_name, customer_phone, cart, total) VALUES($1, $2, $3, $4)`,
       [customerName, customerPhone, JSON.stringify(cartInfo), cartTotal]);

    // const result = await client.messages.create({
    //   body: message,
    //   from: fromPhone,
    //   to: toPhone,
    // });

    // // Send to Customer
    // await client.messages.create({
    //   body: `\n🎉 Thank you ${customerName} for your order! We’ve received your cake order worth ₹${cartTotal}. We'll contact you within 12 hours. ❤️`,
    //   from: fromPhone,
    //   to: "+91" + customerPhone,
    // });

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
