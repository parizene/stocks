import { Database } from "@/lib/supabase.types";
import { extendPosition, getQuote } from "@/lib/yahoo-finance";
import { PositionDb } from "@/types/position-db";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { portfolio_id, symbol } = await req.json();

  const quote = await getQuote(symbol);

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("positions")
    .upsert(
      {
        portfolio_id,
        symbol,
        currency: quote.currency,
      },
      {
        onConflict: "portfolio_id, symbol",
        ignoreDuplicates: true,
      }
    )
    .select();

  if (data) {
    const [positionDb] = data as PositionDb[];

    const position = extendPosition(quote, positionDb);

    return NextResponse.json(position);
  }
  throw error;
}
