import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const userId = Number(req.headers.get('user-id'));

    
    try {
        if(body.phone.length != 10){
            throw new Error('Enter a valid 10 digit number!');
        } else if (body.name.length < 2) {
            throw new Error('Name should be atleast 2 characters!');
        }
    
        if(!userId) {
            throw new Error('Login and try again!');
        }
        
        const updatedUser = await prisma.users.update({
                where: {
                id: userId
            },
            data: {
                name: body.name,
                phone: body.phone
            },
            omit: {
                password: true
            }
        });

        return NextResponse.json({message: 'Profile updated!', user: updatedUser}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: error instanceof Error ? error.message : "Internal Server Error!"}, {status: 400});
    }

  

}