import { useEffect } from "react";
import { BookList } from "@/components/BookList";
import { Layout } from "@/components/Layout";
import { useStore } from "./store";
import { TooltipProvider } from "@/components/ui/tooltip";

export const App = () => {
  const { loadBooksFromLocalStorage } = useStore((state) => state);

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);

  return (
    <Layout>
      <TooltipProvider>
        <BookList />
      </TooltipProvider>
    </Layout>
  );
};
