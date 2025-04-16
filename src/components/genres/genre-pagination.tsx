"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GenrePaginationProps {
  currentPage: number;
  totalPages: number;
  genre: string;
  sort: string;
  onPageChange: (page: number) => void;
  inlinePagination?: boolean;
}

export function GenrePagination({
  currentPage,
  totalPages,
  genre,
  sort,
  onPageChange,
  inlinePagination = false,
}: GenrePaginationProps) {
  // Create pagination links
  const paginationItems = [];
  const maxVisiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxVisiblePages / 2),
      totalPages - maxVisiblePages + 1
    )
  );
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <button
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            i === currentPage
              ? "bg-purple-600 text-white"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      </PaginationItem>
    );
  }

  return (
    <Pagination className="my-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        )}

        {paginationItems}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
