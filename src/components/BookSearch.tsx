import React, { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa6";
import { GiBookPile } from "react-icons/gi";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Book, useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";

export const BookSearch = () => {
  const { books, addBook } = useStore((state) => state);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);

  const resultsPerPage = 100;

  type SearchResult = {
    docs: Book[];
    numFound: number;
  };

  const searchBooks = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);

    try {
      const res = await axios.get<SearchResult>(
        `https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`
      );
      setResults(res.data.docs);
      setTotalResults(res.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data", error);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      searchBooks();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const SearchInput = (
    <div className="flex flex-col items-center gap-3 px-4 py-2 sm:flex-row">
      <div className="relative w-full sm:max-w-xs">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your next book!"
          onKeyUp={handleKeyPress}
        />
      </div>

      <Button
        onClick={() => searchBooks()}
        disabled={isLoading}
        className="max-sm:w-full sm:max-w-xs"
      >
        {isLoading ? (
          <>
            {" "}
            <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> Searching...{" "}
          </>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );

  const SearchResults = (
    <div className="block max-h-[200px] overflow-y-auto sm:max-h-[300px] [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar]:w-2">
      {query.length > 0 && results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="hidden sm:table-cell">Year</TableHead>
              <TableHead className="hidden sm:table-cell">Pages</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {results.map((book, index) => (
              <TableRow key={index}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_name}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {book.first_publish_year || "-"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {book.number_of_pages_median || "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      addBook({
                        ...book,
                        status: "backlog",
                      })
                    }
                    disabled={books.some(
                      (stateBook) => stateBook.key === book.key
                    )}
                  >
                    <GiBookPile className="size-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex max-h-60 items-center justify-center p-16">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start your search
          </p>
        </div>
      )}
    </div>
  );

  const SearchPagination = (
    <div className="flex w-full flex-col items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-between">
      {totalResults > 0 ? (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-bold">
              {startIndex} - {endIndex}
            </span>{" "}
            out of <span className="font-bold">{totalResults}</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Results <span className="font-bold">{totalResults}</span>
        </p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={isLoading || currentPage === 1}
          onClick={handlePrevPage}
        >
          <IoIosArrowBack className="size-4" />
        </Button>
        <span className="mr-2 ml-2">Page {currentPage}</span>
        <Button
          variant="outline"
          disabled={
            isLoading || currentPage > Math.ceil(totalResults / resultsPerPage)
          }
          onClick={handleNextPage}
        >
          <IoIosArrowForward className="size-4" />
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add a new book</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a new book</DialogTitle>
            <DialogDescription>
              Learn every day as it is the last thing in your bucket list.
            </DialogDescription>
            {SearchInput}
          </DialogHeader>
          {SearchResults}
          <DialogFooter>{SearchPagination}</DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add a new book</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add a new book</DrawerTitle>
          <DrawerDescription>
            Learn every day as it is the last thing in your bucket list.
          </DrawerDescription>
          {SearchInput}
        </DrawerHeader>
        {SearchResults}
        <DrawerFooter>{SearchPagination}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
