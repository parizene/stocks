"use client";

import CreatePortfolioDialog from "@/components/CreatePortfolioDialog";
import LoadingProgress from "@/components/LoadingProgress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Portfolio } from "@/types/portfolio";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Portfolios() {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const fetchPortfolios = async () => {
    setLoading(true);

    const res = await fetch(`${location.origin}/api/portfolios`);
    const data = await res.json();

    setLoading(false);
    setPortfolios(data);
  };

  useEffect(() => {
    (async () => {
      fetchPortfolios();
    })();
  }, []);

  const handleDelete = async (id: number) => {
    const res = await fetch(`${location.origin}/api/portfolios/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPortfolios((prevPorfolios) =>
        prevPorfolios.filter((portfolio) => portfolio.id !== id)
      );
    }
  };

  const handleCreatePortfolioClick = () => {
    setDialogOpen((prevDialogOpen) => !prevDialogOpen);
  };

  const handlePortfolioPostSuccess = (portfolio: Portfolio) => {
    setPortfolios((prevPorfolios) => [...prevPorfolios, portfolio]);
  };

  return (
    <main>
      <div className="m-4">
        <div className="flex justify-start">
          <Button onClick={handleCreatePortfolioClick} variant="outline">
            Create Portfolio
          </Button>
        </div>

        <Table className="mt-4 table-fixed=">
          <TableHeader>
            <TableRow>
              <TableHead>Portfolio Name</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={2}>
                  <LoadingProgress />
                </TableCell>
              </TableRow>
            )}
            {portfolios.map((portfolio) => (
              <TableRow key={portfolio.id} className="group h-20">
                <TableCell>
                  <Link
                    className="font-medium"
                    href={`/portfolios/${portfolio.id}`}
                  >
                    {portfolio.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 p-0 hidden group-hover:inline-flex"
                    onClick={() => handleDelete(portfolio.id)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreatePortfolioDialog
        onPorfolioPostSuccess={handlePortfolioPostSuccess}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      />
    </main>
  );
}
