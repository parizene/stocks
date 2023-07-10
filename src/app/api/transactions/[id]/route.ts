import { Database } from "@/lib/supabase.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("transactions")
    .select()
    .eq("id", params.id);
  if (data) {
    const [transaction] = data;
    return NextResponse.json(transaction);
  }
  throw error;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", params.id);
  if (!error) {
    return NextResponse.json(null);
  }
  throw error;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { type, date, quantity, price } = await req.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { error } = await supabase
    .from("transactions")
    .update({
      type,
      date,
      quantity,
      price,
    })
    .eq("id", params.id);
  if (!error) {
    return NextResponse.json(null);
  }
  throw error;
}
