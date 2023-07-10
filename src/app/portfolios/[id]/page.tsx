"use client";

import { AddPosition } from "@/components/AddPosition";
import { PositionsTable } from "@/components/PositionsTable";
import TransactionDialog from "@/components/TransactionDialog";
import { Portfolio } from "@/types/portfolio";
import { Position } from "@/types/position";
import { useEffect, useState } from "react";

export default function Portfolios({ params }: { params: { id: number } }) {
  const [createDialogState, setCreateDialogState] = useState<{
    open: boolean;
    positionId?: number;
    symbol?: string;
    currency?: string;
  }>({
    open: false,
  });
  const [editDialogState, setEditDialogState] = useState<{
    open: boolean;
    positionId?: number;
    symbol?: string;
    currency?: string;
    transactionId?: number;
  }>({
    open: false,
  });
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  const fetchPortfolio = async () => {
    setLoading(true);

    let res = await fetch(`${location.origin}/api/portfolios/${params.id}`);
    const data: Portfolio = await res.json();

    setLoading(false);
    setPortfolio(data);
  };

  const fetchPosition = async (id: number) => {
    setLoading(true);

    let res = await fetch(`${location.origin}/api/positions/${id}`);
    const data: Position = await res.json();

    setLoading(false);
    setPortfolio((prevPorfolio) => {
      if (prevPorfolio) {
        return {
          ...prevPorfolio,
          positions: prevPorfolio.positions?.map((position) => {
            if (position.id === id) {
              return data;
            } else {
              return position;
            }
          }),
        };
      }
      return prevPorfolio;
    });
  };

  const handleSymbolSelect = async (symbol: string) => {
    const res = await fetch(`${location.origin}/api/positions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portfolio_id: params.id,
        symbol,
      }),
    });
    if (res.ok) {
      const position = await res.json();

      setPortfolio((prevPorfolio) => {
        if (prevPorfolio) {
          return {
            ...prevPorfolio,
            positions: [...(prevPorfolio.positions ?? []), position],
          };
        }
        return prevPorfolio;
      });
    }
  };

  const handlePositionDelete = async (id: number) => {
    const res = await fetch(`${location.origin}/api/positions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPortfolio((prevPorfolio) => {
        if (prevPorfolio) {
          return {
            ...prevPorfolio,
            positions: prevPorfolio.positions?.filter(
              (position) => position.id !== id
            ),
          };
        }
        return prevPorfolio;
      });
    }
  };

  const handleTransactionCreate = (position: Position) => {
    setCreateDialogState((prevDialogState) => {
      if (prevDialogState.open) {
        return {
          open: false,
        };
      } else {
        return {
          open: true,
          positionId: position.id,
          symbol: position.symbol,
          currency: position.currency,
        };
      }
    });
  };

  const handleTransactionCreateSuccess = (positionId?: number) => {
    if (positionId) {
      fetchPosition(positionId);
    }
  };

  const handleTransactionEdit = (position: Position, transactionId: number) => {
    setEditDialogState((prevDialogState) => {
      if (prevDialogState.open) {
        return {
          open: false,
        };
      } else {
        return {
          open: true,
          positionId: position.id,
          symbol: position.symbol,
          currency: position.currency,
          transactionId,
        };
      }
    });
  };

  const handleTransactionEditSuccess = (positionId?: number) => {
    if (positionId) {
      fetchPosition(positionId);
    }
  };

  const handleTransactionDelete = async (
    positionId: number,
    transactionId: number
  ) => {
    const res = await fetch(
      `${location.origin}/api/transactions/${transactionId}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok && positionId) {
      fetchPosition(positionId);
    }
  };

  useEffect(() => {
    (async () => {
      fetchPortfolio();
    })();
  }, []);

  return (
    <main>
      <div className="m-4">
        <AddPosition onSymbolSelect={handleSymbolSelect} />

        <div className="mt-4 overflow-x-auto">
          <PositionsTable
            portfolio={portfolio}
            loading={loading}
            onPositionDelete={handlePositionDelete}
            onTransactionCreate={handleTransactionCreate}
            onTransactionEdit={handleTransactionEdit}
            onTransactionDelete={handleTransactionDelete}
          />
        </div>
      </div>

      {createDialogState.open && (
        <TransactionDialog
          type="create"
          positionId={createDialogState.positionId}
          symbol={createDialogState.symbol}
          currency={createDialogState.currency}
          onTransactionCreateSuccess={handleTransactionCreateSuccess}
          open={createDialogState.open}
          onClose={() => {
            setCreateDialogState({
              open: false,
            });
          }}
        />
      )}

      {editDialogState.open && (
        <TransactionDialog
          type="edit"
          positionId={editDialogState.positionId}
          symbol={editDialogState.symbol}
          currency={editDialogState.currency}
          transactionId={editDialogState.transactionId}
          onTransactionEditSuccess={handleTransactionEditSuccess}
          open={editDialogState.open}
          onClose={() => {
            setEditDialogState({
              open: false,
            });
          }}
        />
      )}
    </main>
  );
}
