import { Position } from "@/types/position";
import { PositionDb } from "@/types/position-db";
import { Quote } from "@/types/quote";
import { SearchResult } from "@/types/search-result";
import { Transaction } from "@/types/transaction";
import { SearchResult as YahooFinanceSearchResult } from "yahoo-finance2/dist/esm/src/modules/search";
import { floatify } from "./utils";
const yahooFinance = require("yahoo-finance2").default;
// import yahooFinance from "yahoo-finance2";

export async function getQuote(symbol: string): Promise<Quote> {
  const {
    currency,
    regularMarketPrice,
    regularMarketChange,
    regularMarketChangePercent,
  } = await yahooFinance.quote(symbol);
  return {
    currency,
    regularMarketPrice: regularMarketPrice!,
    regularMarketChange: regularMarketChange!,
    regularMarketChangePercent: regularMarketChangePercent!,
  };
}

export async function getSearchResults(query: string): Promise<SearchResult[]> {
  const searchResult: YahooFinanceSearchResult = await yahooFinance.search(
    query,
    {
      newsCount: 0,
    }
  );
  return searchResult.quotes
    .filter((quote) => quote.isYahooFinance)
    .map((quote) => ({
      symbol: quote.symbol,
      typeDisp: quote.typeDisp,
      exchange: quote.exchange,
      longname: quote.longname,
    }));
}

export function extendPosition(quote: Quote, positionDb: PositionDb): Position {
  const transactions: Transaction[] = [...(positionDb.transactions ?? [])];
  const capitalGainResult = calculateCapitalGain(transactions);
  const currentMarketValue =
    capitalGainResult.remainingShares * quote.regularMarketPrice;
  const unrealizedCapitalGain = floatify(
    currentMarketValue - capitalGainResult.purchasedMarketValue
  );
  return {
    ...positionDb,
    transactions,
    quote,
    remainingShares: capitalGainResult.remainingShares,
    purchasedMarketValue: floatify(capitalGainResult.purchasedMarketValue),
    currentMarketValue,
    realizedCapitalGain: capitalGainResult.realizedCapitalGain,
    unrealizedCapitalGain: unrealizedCapitalGain,
  };
}

type CapitalGainResult = {
  remainingShares: number;
  purchasedMarketValue: number;
  realizedCapitalGain: number;
};

function calculateCapitalGain(transactions: Transaction[]): CapitalGainResult {
  let remainingShares = 0;
  let purchasedMarketValue = 0;
  let realizedCapitalGain = 0;

  const usedBuyShares: Record<number, number> = {};

  for (const transaction of transactions) {
    if (transaction.type === "BUY") {
      remainingShares += transaction.quantity;
      purchasedMarketValue += transaction.quantity * transaction.price;

      if (!usedBuyShares[transaction.id]) {
        usedBuyShares[transaction.id] = 0;
      }
    } else if (transaction.type === "SELL") {
      let soldShares = transaction.quantity;
      let remainingToSell = soldShares;

      for (const buyTransaction of transactions.filter(
        (t) => t.type === "BUY" && usedBuyShares[t.id] < t.quantity
      )) {
        const availableShares = Math.min(
          buyTransaction.quantity - usedBuyShares[buyTransaction.id],
          remainingToSell
        );
        remainingToSell -= availableShares;

        usedBuyShares[buyTransaction.id] += availableShares;
        purchasedMarketValue -= availableShares * buyTransaction.price;
        realizedCapitalGain +=
          availableShares * (transaction.price - buyTransaction.price);

        if (remainingToSell === 0) {
          break;
        }
      }

      remainingShares -= soldShares;
    }
  }

  return {
    remainingShares,
    purchasedMarketValue,
    realizedCapitalGain,
  };
}
