import { NextResponse, type NextRequest } from "next/server"

// ─── AUTH BYPASS — TESTING MODE ──────────────────────────────────────────────
// Remove the early return below to restore full auth enforcement.
// All original logic is preserved underneath, untouched.
// ─────────────────────────────────────────────────────────────────────────────
export function middleware(_request: NextRequest) {
  return NextResponse.next() // BYPASS: skip all auth checks
}

// ─── Original auth middleware (kept for reference) ───────────────────────────
// import { NextResponse, type NextRequest } from "next/server"
//
// const AUTH_PATHS = ["/login", "/register"]
// const PROTECTED_PATHS = ["/dashboard", "/bookings", "/calls", "/agent", "/settings", "/onboarding"]
//
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get("glork-token")?.value
//   const isAuthenticated = !!token
//
//   if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }
//   if (pathname === "/" && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }
//   if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
//     const loginUrl = new URL("/login", request.url)
//     loginUrl.searchParams.set("from", pathname)
//     return NextResponse.redirect(loginUrl)
//   }
//   return NextResponse.next()
// }

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
