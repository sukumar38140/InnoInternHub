import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/dashboard"];
// List of routes that are only for unauthenticated users
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Next.js cannot read localStorage in middleware, but it can read cookies.
    // If the authentication system uses HttpOnly cookies for session/refresh tokens,
    // we could check for them here.
    // Since the current app heavily relies on localStorage (which is invisible to the server),
    // we need to be careful. However, we can check for the presence of the refresh token cookie
    // if the backend sets one. If not, this middleware might redirect valid users who only have localStorage.
    
    // For this specific architecture (which uses localStorage for the access token),
    // server-side middleware cannot reliably check auth state unless cookies are used.
    // Assuming the backend sets a cookie (like 'refresh_token' or similar) when authenticated:
    
    // Let's implement a basic check: if they are trying to access an auth route but have a session cookie,
    // we redirect to dashboard.
    // Since the actual token is in localStorage, we can't fully block dashboard routes safely here
    // without risking blocking valid users. Let's rely on client-side `withAuth` for dashboard,
    // but at least prevent routing loops if we can.

    // Given the architecture we saw in `auth-context.tsx`, it uses localStorage for `innohub_access_token`.
    // Middleware runs on the Edge and cannot access localStorage.
    // Thus, we shouldn't strictly block protected routes here unless we are sure a cookie exists.
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
