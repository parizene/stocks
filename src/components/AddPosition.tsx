"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchResult } from "@/types/search-result";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";

export function AddPosition({
  onSymbolSelect,
}: {
  onSymbolSelect(symbol: string): void;
}) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);

  const handleSymbolChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const symbol = e.target.value;
    if (symbol.length) {
      debouncedFetch(symbol);
    } else {
      setSearchResults([]);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setSearchResults([]);
    }
  };

  const fetchData = async (symbol: string) => {
    try {
      const response = await fetch(
        `${location.origin}/api/yahoo-finance/search?query=${encodeURIComponent(
          symbol
        )}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetch = debounce(fetchData, 300);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline">Add Position</Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96" align="start">
        <div>
          <Input
            type="text"
            id="symbol"
            name="symbol"
            placeholder="Symbol"
            onChange={handleSymbolChange}
          />
        </div>

        <ul>
          {searchResults.length > 0 &&
            searchResults.map((searchResult, index) => (
              <li
                key={index}
                className="p-2 first:mt-4 hover:cursor-pointer hover:rounded-md hover:bg-muted/50"
                onClick={() => {
                  handleOpenChange(false);

                  onSymbolSelect(searchResult.symbol);
                }}
              >
                <div className="flex justify-between whitespace-nowrap px-2">
                  <div className="mr-2 truncate">
                    <p className="font-medium">{searchResult.symbol}</p>
                    <p className="inline text-sm">{searchResult.longname}</p>
                  </div>
                  <p className="text-sm">{`${searchResult.typeDisp} - ${searchResult.exchange}`}</p>
                </div>
              </li>
            ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
