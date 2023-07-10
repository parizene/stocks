import { getSearchResults } from "@/lib/yahoo-finance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (query) {
    return NextResponse.json(await getSearchResults(query));
  }
  return NextResponse.json([]);
}
