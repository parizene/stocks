"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, roundToDecimal } from "@/lib/utils";
import { Portfolio } from "@/types/portfolio";
import { Position } from "@/types/position";
import { ChevronsUpDownIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import LoadingProgress from "./LoadingProgress";
import TransactionTable from "./TransactionsTable";

export function PositionsTable({
  portfolio,
  loading,
  onPositionDelete,
  onTransactionCreate,
  onTransactionEdit,
  onTransactionDelete,
}: {
  portfolio: Portfolio | null;
  loading: boolean;
  onPositionDelete(id: number): void;
  onTransactionCreate(position: Position): void;
  onTransactionEdit(position: Position, id: number): void;
  onTransactionDelete(positionId: number, id: number): void;
}) {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const handleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((expandedId) => expandedId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  return (
    <Table className="min-w-full">
      <TableCaption>{portfolio?.name}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16"></TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Last Price</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
          <TableHead className="text-right">Market Value</TableHead>
          <TableHead className="text-right">Capital Gain (Realized)</TableHead>
          <TableHead className="text-right">
            Capital Gain (Unrealized)
          </TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={10}>
              <LoadingProgress />
            </TableCell>
          </TableRow>
        )}
        {portfolio?.positions?.map((position) => (
          <React.Fragment key={position.id}>
            <TableRow
              className={`group${
                expandedIds.includes(position.id) ? " border-b-0" : ""
              }`}
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 p-0"
                  onClick={() => handleExpand(position.id)}
                >
                  <ChevronsUpDownIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
              </TableCell>

              <TableCell>
                <Link
                  className="font-medium"
                  href={`https://finance.yahoo.com/quote/${position.symbol}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {position.symbol}
                </Link>
              </TableCell>

              <TableCell className="text-right">
                {position.quote.regularMarketPrice && (
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: position.currency,
                    }).format(position.quote.regularMarketPrice)}
                  </span>
                )}
              </TableCell>

              <TableCell className="text-right">
                {position.quote.regularMarketChange &&
                position.quote.regularMarketChangePercent ? (
                  <div
                    className={cn(
                      "flex flex-col",
                      `${
                        position.quote.regularMarketChange > 0 &&
                        position.quote.regularMarketChangePercent > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`
                    )}
                  >
                    <span className="inline-block">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: position.currency,
                      }).format(position.quote.regularMarketChange)}
                    </span>
                    <span className="text-xs inline-block">
                      {`${roundToDecimal(
                        position.quote.regularMarketChangePercent,
                        2
                      )}%`}
                    </span>
                  </div>
                ) : null}
              </TableCell>

              <TableCell className="text-right">
                {position.remainingShares ? position.remainingShares : null}
              </TableCell>

              <TableCell className="text-right">
                {position.purchasedMarketValue
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: position.currency,
                    }).format(position.purchasedMarketValue)
                  : null}
              </TableCell>

              <TableCell className="text-right">
                {position.currentMarketValue
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: position.currency,
                    }).format(position.currentMarketValue)
                  : null}
              </TableCell>

              <TableCell className="text-right">
                {position.realizedCapitalGain ? (
                  <span
                    className={`${
                      position.realizedCapitalGain > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: position.currency,
                    }).format(position.realizedCapitalGain)}
                  </span>
                ) : null}
              </TableCell>

              <TableCell className="text-right">
                {position.unrealizedCapitalGain ? (
                  <span
                    className={`${
                      position.unrealizedCapitalGain > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: position.currency,
                    }).format(position.unrealizedCapitalGain)}
                  </span>
                ) : null}
              </TableCell>

              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 p-0 hidden group-hover:inline-flex"
                  onClick={() => onPositionDelete(position.id)}
                >
                  <TrashIcon className="w-5 h-5 text-red-400" />
                </Button>
              </TableCell>
            </TableRow>
            {expandedIds.includes(position.id) && (
              <TableRow className="hover:bg-background bg-background">
                <TableCell colSpan={10}>
                  <div className="border">
                    <Button
                      variant={"link"}
                      onClick={() => onTransactionCreate(position)}
                      className="mt-2"
                    >
                      Add Transaction
                    </Button>

                    <div className="mt-4">
                      <TransactionTable
                        transactions={position.transactions}
                        currency={position.currency}
                        onTransactionEdit={(transactionId) =>
                          onTransactionEdit(position, transactionId)
                        }
                        onTransactionDelete={(transactionId) =>
                          onTransactionDelete(position.id, transactionId)
                        }
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
