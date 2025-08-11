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

  const adminPaths = ['/admin/addproduct', '/api/editproduct', '/api/addproduct', '/api/deleteproduct/', '/admin/manageusers', '/api/getallusers', '/api/updateuser', '/api/deleteuser', '/api/getallorders', '/admin/allorders'];
  const protectedPaths = ['/cart', '/orders', '/api/orders', '/api/checkout', '/myprofile', '/api/customorder', '/custom-cakes' , '/api/sendverificationemail', '/api/updateprofile', '/api/changepassword'];
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;
  
  
  if(pathname == "/login" && token){
    try {
      const decoded = await verifyJWT(token);
      return NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }else if(pathname == "/login" && !token){
    return NextResponse.next();
  }


  const isAdminPath = adminPaths.some((path)=>
    pathname.startsWith(path))

  const isProtectedPath = protectedPaths.some((path)=>
    pathname.startsWith(path));

  if(isProtectedPath && token) {
    const decoded = await verifyJWT(token);
    if(!decoded){
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('auth_token');
      return response;
    }
    const response = NextResponse.next();
    response.headers.set("user-id", String(decoded.userId));
    response.headers.set("user-role", String(decoded.role));
    return response;
  }else if(isAdminPath && token){
    const decoded = await verifyJWT(token);
    if(!decoded || decoded.role != 'ADMIN'){
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('auth_token');
      return response;
    }
    const response = NextResponse.next();

    response.headers.set("user-id", String(decoded.userId));
    response.headers.set("user-role", String(decoded.role));
    return response;
  } else {
      const response = NextResponse.redirect(new URL('/login', req.url));
      return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login", '/api/editproduct/:id*', '/api/addproduct', '/api/deleteproduct/:id*',
     '/api/orders', '/api/orders/:id*', '/api/checkout', '/cart', '/checkout', '/myprofile', '/orders', '/api/orders', 
    '/api/myprofile', '/custom-cakes', '/api/customorder', '/api/getallusers', '/api/updateuser', '/api/deleteuser', '/api/getallorders',
   '/api/sendverificationemail', '/api/updateprofile', '/api/changepassword'],
};
