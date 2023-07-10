"use client";

import { Portfolio } from "@/types/portfolio";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CreatePortfolioDialog = ({
  onPorfolioPostSuccess,
  open,
  onClose,
}: {
  onPorfolioPostSuccess(portfolio: Portfolio): void;
  open?: boolean;
  onClose?(): void;
}) => {
  const [portfolio, setPortfolio] = useState<{
    name?: string;
  }>({});

  const handlePortfolioNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPortfolio((prevPortfolio) => ({
      ...prevPortfolio,
      name: e.target.value,
    }));
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose?.();

    const res = await fetch(`${location.origin}/api/portfolios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(portfolio),
    });
    if (res.ok) {
      const resultPortfolio = await res.json();

      onPorfolioPostSuccess(resultPortfolio);
    }
  };

  const isValid = () => {
    if (portfolio.name === undefined || portfolio.name.length === 0) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (open) {
      setPortfolio({});
    }
  }, [open]);

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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Portfolio</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 my-8">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="portfolio_name" className="text-right col-span-2">
                Portfolio Name
              </Label>
              <Input
                type="text"
                id="portfolio_name"
                name="portfolio_name"
                className="col-span-3"
                onChange={handlePortfolioNameChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isValid()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
