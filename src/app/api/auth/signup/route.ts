import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const getUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";
  url = url.includes("http") ? url : `https://${url}`;
  return url;
};

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { email, password } = await req.json();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getUrl()}/api/auth/callback`,
    },
  });
  if (!error) {
    return NextResponse.json({
      id: user?.id,
      email: user?.email,
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
