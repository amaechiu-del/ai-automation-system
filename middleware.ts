import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Define your main domain
  const rootDomain = 'domislink.com';

  // Extract the subdomain (e.g., "agent1" from "agent1.domislink.com")
  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, '')
    : null;

  if (subdomain && subdomain !== 'www') {
    // This is where the magic happens: 
    // It rewrites the URL internally so /subdomains/agent1 handles the request
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}