import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "./lib/supabase.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;
  if (!session) {
    if (
      pathname.startsWith("/api") &&
      (!pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/auth/signout"))
    ) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    } else if (pathname.startsWith("/portfolios")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return res;
}
