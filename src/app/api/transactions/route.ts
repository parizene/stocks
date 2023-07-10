import { Database } from "@/lib/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { position_id, type, date, quantity, price } = await req.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { error } = await supabase.from("transactions").insert({
    position_id,
    type,
    date,
    quantity,
    price,
  });
  if (!error) {
    return NextResponse.json(null);
  }
  throw error;
}
