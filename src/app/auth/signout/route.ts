import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      return NextResponse.redirect(new URL("/", req.url), {
        status: 302,
      });
    } else {
      console.error(JSON.stringify(error, null, 2));

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        }
      );
    }
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
