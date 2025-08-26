import { NextResponse } from "next/server";

export function middleware(req) {
  const origin = req.headers.get("origin");
  const res = NextResponse.next();

  // ✅ Allow only your frontend origin
  if (origin === "http://localhost:3000") {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: res.headers,
    });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
