import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isUserRoute = createRouteMatcher(['/dashboard/user(.*)']);
const isAnalystRoute = createRouteMatcher(['/dashboard/analyst(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Redirect to sign-in if accessing protected routes and not logged in
  if ((isUserRoute(req) || isAnalystRoute(req) || isAdminRoute(req)) && !userId) {
     await auth.protect();
  }

  // Role verification (authorization)
  const role = sessionClaims?.metadata?.role;

  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isAnalystRoute(req) && role !== 'analyst' && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isUserRoute(req) && role === 'analyst') {
     return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
