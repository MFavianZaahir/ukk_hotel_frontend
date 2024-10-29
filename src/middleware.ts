import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

// Secret key for JWT verification, encoded for use with 'jose'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Define the structure for our custom JWT payload, including 'role' property
interface CustomJWTPayload extends JWTPayload {
    role: "admin" | "resepsionis" | "pelanggan";
}

// Define accessible paths for each role in a dictionary
type RolePaths = {
  [key in CustomJWTPayload["role"]]: string[];
};

export async function middleware(request: NextRequest) {
  // Retrieve token from cookies
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // If no token is present and the user is not accessing the login page, redirect to login
  if (!token && !pathname.startsWith("/auth/login")) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to login-related paths without a token
  if (!token && pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  // Handle cases where token might be invalid or undefined
  if (!token) {
    throw new Error("Token is undefined or empty");
  }

  try {
    // Verify JWT token using the provided secret
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const typedPayload = payload as CustomJWTPayload;
    const userRole = typedPayload.role;

    console.log(`User Role: ${userRole}, Pathname: ${pathname}`);

    // Define the accessible paths for each role
    const rolePaths: RolePaths = {
      admin: ["/api/admin", "/admin/"],
      resepsionis: ["/api/resepsionis", "/resepsionis/"],
      pelanggan: ["/api/pelanggan", "/pelanggan/"],
    };

    // Function to check if the user's role has access to the current path
    const hasAccess = rolePaths[userRole].some((path) => pathname.startsWith(path));

    // Redirect logged-in users trying to access login pages to their dashboard
    if (pathname.startsWith("/auth/login")) {
      console.log(`Already logged in as ${userRole}, redirecting to dashboard`);
      return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }

    // Redirect if the user tries to access a path not permitted for their role
    if (!hasAccess) {
      console.log(`Access denied for ${userRole}, redirecting to home page`);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access if all checks pass
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);

    // Redirect to login and clear cookies if token verification fails
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.set("token", "", { maxAge: -1 });
    response.cookies.set("name", "", { maxAge: -1 });
    response.cookies.set("username", "", { maxAge: -1 });
    return response;
  }
}

// Define routes the middleware will be applied to
export const config = {
  matcher: [
    "/admin/:path*",
    "/resepsionis/:path*",
    "/pelanggan/:path*",
    "/auth/login",
    "/auth/login-as-guest",
  ],
};
