import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "./lib/supabase.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    if (req.nextUrl.pathname.startsWith("/portfolios")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    if (req.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return res;
}
