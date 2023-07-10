import { Transaction } from "@/types/transaction";
import { MoreVertical } from "lucide-react";
import moment from "moment";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const TransactionTable = ({
  transactions,
  currency,
  onTransactionEdit,
  onTransactionDelete,
}: {
  transactions: Transaction[] | null;
  currency: string;
  onTransactionEdit?(transactionId: number): void;
  onTransactionDelete?(transactionId: number): void;
}) => {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Transaction Type</TableHead>
          <TableHead>Trade Date</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Cost / Share</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((transaction) => {
          return (
            <TableRow className="border-b-0" key={transaction.id}>
              <TableCell className="font-semibold">
                {transaction.type}
              </TableCell>
              <TableCell>
                {moment(new Date(transaction.date)).format("DD.MM.YYYY")}
              </TableCell>
              <TableCell className="text-right">
                {transaction.quantity}
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                }).format(transaction.price)}
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                }).format(transaction.quantity * transaction.price)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <MoreVertical className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => {
                        onTransactionEdit?.(transaction.id);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        onTransactionDelete?.(transaction.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
