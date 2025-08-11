import nodemailer from 'nodemailer';
import { SignJWT } from 'jose';

export async function verification(userId: number, email: string, name: string, type: 'verification' | 'forgot_password') {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const verificationToken = await new SignJWT({ userId: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(process.env.EMAIL_JWT_SECRET));

    if(type === 'forgot_password') {
        const passwordResetLink = `${process.env.FRONTEND_URL}/password-reset?token=${verificationToken}`;
        await transporter.sendMail({
             from: process.env.GMAIL_EMAIL,
             to: email,
             subject: "Password Reset Link - Saru's Kitchen",
             text: `Hi ${name},\n\nPlease reset your password by clicking the following link or pasting it in your browser:\n${passwordResetLink}\n\nThis link expires in 1 hour.\n\n`,
            });
    }
     else {
         const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
         await transporter.sendMail({
             from: process.env.GMAIL_EMAIL,
             to: email,
             subject: "Verify your email - Saru's Kitchen",
             text: `Hi ${name},\n\nPlease verify your email by clicking the following link or pasting it in your browser:\n${verificationLink}\n\nThis link expires in 1 hour.\n\n`,
            });
    }
}