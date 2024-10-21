import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify, JWTVerifyResult,jwtDecrypt } from "jose";
const jwt = require('jsonwebtoken');

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
interface CustomJWTPayload extends JWTPayload {
    role: "admin" | "resepsionis" | "pelanggan";
  
}
type RolePaths = {
  [key in CustomJWTPayload["role"]]: string[];
};
export async function middleware(request: NextRequest) {
  console.log("Middleware triggered");
  console.log(JWT_SECRET);
  
  const token = request.cookies.get("token")?.value;
  console.log(token)
  if (!token && !request.nextUrl.pathname.startsWith("/auth/login")) {
    console.log("No token found, redirecting to login");
    console.log(request.nextUrl.pathname);

    return NextResponse.redirect(new URL(`/`, request.url));
  }
  if (!token && request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }
  if (!token) throw new Error("Token is undefined or empty");
  try {
    const {payload} = await jwtVerify(token,JWT_SECRET);
    console.log(payload);
    
    const typedPayload = payload as CustomJWTPayload;
    const userRole = typedPayload.role;
    const pathname = request.nextUrl.pathname;

    console.log(`User Role: ${userRole}, Pathname: ${pathname}`);

    const rolePaths: RolePaths = {
      admin: ["/api/admin", "/admin/"],
      resepsionis: ["/api/cashier", "/resepsionis/"],
      pelanggan: ["/api/customer", "/pelanggan/"],
    };

    const isPathRestricted = (role: CustomJWTPayload["role"]) => {
      return rolePaths[role].some((path) => pathname.startsWith(path));
    };
    if (
      pathname.startsWith("/auth/login") &&
      Boolean(
        userRole === "admin" || userRole === "resepsionis" || userRole === "pelanggan"
      )
    ) {
      console.log(
        "You've Already Logged In, Redirecting To Your Dashboard... [" +
          userRole +
          "]"
      );

      const response = NextResponse.redirect(
        new URL(`/${userRole}/dashboard`, request.url)
      );
      return response;
    }
    if (!isPathRestricted(userRole)) {
      console.log(
        "Access denied, redirecting to your dashboard [" + userRole + "]"
      );
      return NextResponse.redirect(
        new URL(`/`, request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear cookies and redirect to login on error
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.set("token", "", { maxAge: -1 });
    response.cookies.set("name", "", { maxAge: -1 });
    response.cookies.set("username", "", { maxAge: -1 });
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/resepsionis/:path*",
    "/pelanggan/:path*",
    "/auth/login",
    "/auth/login-as-guest",
  ],
};