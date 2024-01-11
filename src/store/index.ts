import { create } from "zustand";

export type Book = {
  key: string;
  title: string;
  author_name: string[];
  first_publish_year: number;
  number_of_pages_median: number | null;
  status: "done" | "inProgress" | "backlog";
};

interface BookState {
  books: Book[];
}

interface BookStore extends BookState {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newStatus: Book["status"]) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (
    listType: Book["status"],
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useStore = create<BookStore>((set) => ({
  books: [],

  addBook: (newBook) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = [
        ...state.books,
        {
          key: newBook.key,
          title: newBook.title,
          author_name: newBook.author_name,
          first_publish_year: newBook.first_publish_year,
          number_of_pages_median: newBook.number_of_pages_median || null,
          status: newBook.status || "backlog",
        },
      ];

      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  removeBook: (bookToRemove) =>
    set((state: BookState) => {
      if (window.confirm("Are you sure you want to remove this book?")) {
        const updatedBooks: Book[] = state.books.filter(
          (book) => book.key !== bookToRemove.key
        );

        localStorage.setItem("readingList", JSON.stringify(updatedBooks));

        return { books: updatedBooks };
      }
      return state;
    }),

  moveBook: (bookToMove, newStatus) =>
    set((state: BookState) => {
      const updatedBooks: Book[] = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, status: newStatus } : book
      );

      localStorage.setItem("readingList", JSON.stringify(updatedBooks));

      return { books: updatedBooks };
    }),

  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem("readingList");

    if (storedBooks) {
      set({ books: JSON.parse(storedBooks) });
    }
  },

  reorderBooks: (listType, startIndex, endIndex) =>
    set((state: BookState) => {
      const filteredBooks = state.books.filter(
        (book) => book.status === listType
      );

      const [reorderedBook] = filteredBooks.splice(startIndex, 1);

      filteredBooks.splice(endIndex, 0, reorderedBook);

      const updatedBooks = state.books.map((book) =>
        book.status === listType ? filteredBooks.shift() || book : book
      );

      localStorage.setItem("readingList", JSON.stringify(updatedBooks));

      return { books: updatedBooks };
    }),
}));
