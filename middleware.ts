import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const user = request.cookies.get("user")?.value;
  let userData;

  try {
    userData = user ? JSON.parse(user) : null;
  } catch (error) {
    userData = null;
  }

  // If user is logged in and tries to access auth pages (login/register)
  if (
    token &&
    userData &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/register")
  ) {
    if (userData.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/customer", request.url));
    }
  }

  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token || !userData) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userData.role !== "admin") {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check if it's a customer route
  if (request.nextUrl.pathname.startsWith("/customer")) {
    if (!token || !userData) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userData.role !== "customer") {
      // Redirect non-customer users to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

// Check if it's a customer route

// Configure the paths that should be protected
export const config = {
  matcher: ["/admin/:path*", "/", "/register", "/customer/:path*"],
};
