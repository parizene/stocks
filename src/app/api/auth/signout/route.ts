import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.signOut();
  if (!error) {
    return NextResponse.json(null);
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
