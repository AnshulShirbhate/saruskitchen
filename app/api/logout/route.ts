import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({mesasge: "Logged out successfully!"}, {status: 200});
    response.cookies.delete('auth_token');
    return response;
  } catch (error) {
    return NextResponse.json({message: "Failed to log out!"}, {status: 500});
  }
}
