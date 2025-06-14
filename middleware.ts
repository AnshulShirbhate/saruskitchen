import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;
  
  if(pathname == "/login" && token){
    return NextResponse.redirect(new URL("/admin/addproduct", req.url));
  }else if(pathname == "/login" && !token){
    return NextResponse.next();
  }
  
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
