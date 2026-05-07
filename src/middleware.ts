import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const { auth } = NextAuth(authConfig);
export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isEditorRoute = nextUrl.pathname.startsWith("/editor");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
  if ((isDashboardRoute || isEditorRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
