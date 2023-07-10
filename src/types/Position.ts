import { Quote } from "./quote";
import { Transaction } from "./transaction";

export type Position = {
  id: number;
  portfolio_id: number;
  symbol: string;
  currency: string;
  transactions: Transaction[];
  quote: Quote;
  remainingShares: number;
  purchasedMarketValue: number;
  currentMarketValue: number;
  realizedCapitalGain: number;
  unrealizedCapitalGain: number;
};
