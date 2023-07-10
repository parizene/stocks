import { Database } from "@/lib/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.from("portfolios").select();
  if (data) {
    return NextResponse.json(data);
  }
  throw error;
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      name,
    })
    .select();
  if (data) {
    const [portfolio] = data;
    return NextResponse.json(portfolio);
  }
  throw error;
}
