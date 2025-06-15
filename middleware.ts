import { NextRequest, NextResponse } from "next/server";
import {jwtVerify} from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyJWT(token: string){
  try{
    const {payload} = await jwtVerify(token, secret);
    return payload;
  } catch (err){
    return null;
  }
}


export async function middleware(req: NextRequest) {

  const protectedPaths = ['/admin/addproduct', '/api/editproduct', '/api/addproduct', '/api/deleteproduct/'];

  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;
  
  if(pathname == "/login" && token){
    return NextResponse.redirect(new URL("/admin/addproduct", req.url));
  }else if(pathname == "/login" && !token){
    return NextResponse.next();
  }


  const isProtected = protectedPaths.some((path)=>
    pathname.startsWith(path))

  if(!isProtected)return NextResponse.next();
  
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const decoded = await verifyJWT(token);

  if(!decoded || decoded.role != 'admin'){
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", '/api/editproduct', '/api/addproduct', '/api/deleteproduct/:id*'],
};
