import { Database } from "@/lib/supabase.types";
import { extendPosition, getQuote } from "@/lib/yahoo-finance";
import { PositionDb } from "@/types/position-db";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("positions")
    .select("*, transactions (*)")
    .eq("id", params.id)
    .order("date", { foreignTable: "transactions", ascending: true });
  if (data) {
    const [positionDb] = data as PositionDb[];

    const quote = await getQuote(positionDb.symbol);
    const position = extendPosition(quote, positionDb);

    return NextResponse.json(position);
  }
  throw error;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { error } = await supabase
    .from("positions")
    .delete()
    .eq("id", params.id);
  if (!error) {
    return NextResponse.json(null);
  }
  throw error;
}
