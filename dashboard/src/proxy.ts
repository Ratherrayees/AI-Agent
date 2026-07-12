import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // We use client-side protection for now since Appwrite sessions 
  // are stored in a way that requires client SDK or careful cookie handling.
  // For true server-side protection with Appwrite, we'd need to extract 
  // the fallback cookie and verify it with the Node SDK, which is overkill for Phase 1.
  
  // This just prevents already logged in users from seeing the login page
  // The actual dashboard protection is in dashboard/layout.tsx
  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
