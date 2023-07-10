import { Database } from "@/lib/supabase.types";
import { extendPosition, getQuote } from "@/lib/yahoo-finance";
import { Portfolio } from "@/types/portfolio";
import { PortfolioDb } from "@/types/portfolio-db";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("portfolios")
    .select("*, positions (*, transactions (*))")
    .eq("id", params.id)
    .order("date", { foreignTable: "positions.transactions", ascending: true });
  if (data) {
    const [portfolioDb] = data as PortfolioDb[];

    const positionsPromises = (portfolioDb.positions ?? []).map(
      async (positionDb) => {
        const quote = await getQuote(positionDb.symbol);
        return extendPosition(quote, positionDb);
      }
    );

    const portfolio: Portfolio = {
      ...portfolioDb,
      positions: await Promise.all(positionsPromises),
    };

    return NextResponse.json(portfolio);
  }
  throw error;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { error } = await supabase
    .from("portfolios")
    .delete()
    .eq("id", params.id);
  if (!error) {
    return NextResponse.json(null);
  }
  throw error;
}
