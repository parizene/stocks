import { Transaction } from "./transaction";

export type PositionDb = {
  id: number;
  portfolio_id: number;
  symbol: string;
  currency: string;
  transactions?: Transaction[];
};
