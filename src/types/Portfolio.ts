import { Position } from "./position";

export type Portfolio = {
  id: number;
  name: string;
  positions?: Position[];
};
