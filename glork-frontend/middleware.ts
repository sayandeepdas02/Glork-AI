import { NextResponse, type NextRequest } from "next/server"

const AUTH_PATHS = ["/login", "/register"]
const PROTECTED_PATHS = ["/dashboard", "/bookings", "/calls", "/agent", "/settings", "/onboarding"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("glork-token")?.value
  const isAuthenticated = !!token

  // Auth pages → redirect already-logged-in users to dashboard
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Landing page → redirect authenticated users to dashboard
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protected pages → redirect unauthenticated users to login
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}
