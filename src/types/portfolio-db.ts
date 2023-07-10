import { PositionDb } from "./position-db";

export type PortfolioDb = {
  id: number;
  name: string;
  positions?: PositionDb[];
};
