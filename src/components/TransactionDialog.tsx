"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TransactionDialog = ({
  type,
  positionId,
  symbol,
  currency,
  transactionId,
  onTransactionCreateSuccess,
  onTransactionEditSuccess,
  open,
  onClose,
}: {
  type: "create" | "edit";
  positionId?: number;
  symbol?: string;
  currency?: string;
  transactionId?: number;
  onTransactionCreateSuccess?(positionId?: number): void;
  onTransactionEditSuccess?(positionId?: number): void;
  open?: boolean;
  onClose?(): void;
}) => {
  const [transaction, setTransaction] = useState<{
    type: "BUY" | "SELL";
    date?: string;
    quantity?: number;
    price?: number;
  }>({
    type: "BUY",
  });

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose?.();

    if (type === "create") {
      const body = JSON.stringify({
        position_id: positionId,
        ...transaction,
      });
      const res = await fetch(`${location.origin}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (res.ok) {
        onTransactionCreateSuccess?.(positionId);
      }
    } else {
      const body = JSON.stringify(transaction);
      const res = await fetch(
        `${location.origin}/api/transactions/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );
      if (res.ok) {
        onTransactionEditSuccess?.(positionId);
      }
    }
  };

  const isValid = () => {
    if (
      !transaction.date ||
      !moment(transaction.date, "YYYY-MM-DD").isValid()
    ) {
      return false;
    }

    if (!transaction.quantity) {
      return false;
    }

    if (!transaction.price) {
      return false;
    }

    return true;
  };

  const fetchData = async () => {
    const res = await fetch(
      `${location.origin}/api/transactions/${transactionId}`
    );
    const data = await res.json();
    setTransaction({
      type: data.type,
      date: data.date,
      quantity: data.quantity,
      price: data.price,
    });
  };

  useEffect(() => {
    if (open && type === "edit") {
      fetchData();
    }
  }, [open, type]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          throw Error("Illegal open state!");
        } else {
          onClose?.();
        }
      }}
    >
      <DialogContent className="flex justify-center sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "create" ? "Add" : "Edit"} Transaction ({symbol})
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-8">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="type" className="text-right col-span-2">
                Transaction Type
              </Label>
              <div id="type" className="col-span-3">
                <Select
                  onValueChange={(value: "BUY" | "SELL") => {
                    setTransaction((prevTransaction) => ({
                      ...prevTransaction,
                      type: value,
                    }));
                  }}
                  value={transaction.type}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label className="text-right col-span-2">Trade Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <Button
                      variant={"outline"}
                      className={cn(
                        "font-normal",
                        !transaction.date && "text-muted-foreground"
                      )}
                    >
                      {transaction.date ? (
                        moment(new Date(transaction.date)).format("DD.MM.YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        transaction.date
                          ? new Date(transaction.date)
                          : undefined
                      }
                      onSelect={(date) => {
                        setTransaction((prevTransaction) => ({
                          ...prevTransaction,
                          date: date
                            ? moment(date).format("YYYY-MM-DD")
                            : undefined,
                        }));
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="quantity" className="text-right col-span-2">
                Shares
              </Label>
              <Input
                type="number"
                id="quantity"
                className="col-span-3"
                value={transaction.quantity || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.valueAsNumber;
                  const quantity = !isNaN(value) ? value : undefined;
                  setTransaction((prevTransaction) => ({
                    ...prevTransaction,
                    quantity,
                  }));
                }}
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="price" className="text-right col-span-2">
                Cost / Share ({currency})
              </Label>
              <Input
                type="number"
                id="price"
                className="col-span-3"
                step="0.01"
                value={transaction.price || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.valueAsNumber;
                  const price = !isNaN(value) ? value : undefined;
                  setTransaction((prevTransaction) => ({
                    ...prevTransaction,
                    price,
                  }));
                }}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={!isValid()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
