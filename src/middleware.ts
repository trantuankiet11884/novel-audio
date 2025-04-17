import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add cache control headers for static assets
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.match(/\.(jpe?g|png|svg|webp|gif|ico|css|js)$/i)
  ) {
    // Cache for 1 year
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/_next/static/:path*",
    "/images/:path*",
  ],
};
