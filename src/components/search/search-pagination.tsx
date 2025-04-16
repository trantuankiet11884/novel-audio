"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState<string>("");
  const maxPagesToShow = 5; // Số nút trang tối đa hiển thị
  const pages: (number | string)[] = [];

  // Tính toán các trang để hiển thị
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

  // Thêm các trang vào mảng
  for (let i = adjustedStartPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Thêm dấu chấm lửng và trang đầu/cuối
  if (adjustedStartPage > 2) {
    pages.unshift("...");
    pages.unshift(1);
  } else if (adjustedStartPage === 2) {
    pages.unshift(1);
  }

  if (endPage < totalPages - 1) {
    pages.push("...");
    pages.push(totalPages);
  } else if (endPage === totalPages - 1) {
    pages.push(totalPages);
  }

  // Xử lý nhảy trang qua ô nhập
  const handlePageInput = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages && !isNaN(pageNum)) {
      onPageChange(pageNum);
      setInputPage(""); // Xóa ô nhập sau khi nhảy trang
    }
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
      {/* Nút Previous */}
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Go to previous page"
      >
        Previous
      </Button>

      {/* Các nút trang */}
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        ) : (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        )
      )}

      {/* Nút Next */}
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Go to next page"
      >
        Next
      </Button>

      {/* Ô nhập trang */}
      <form onSubmit={handlePageInput} className="flex items-center gap-2 ml-4">
        <Input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder={`1-${totalPages}`}
          className="w-24"
          min={1}
          max={totalPages}
          aria-label="Enter page number"
        />
        <Button type="submit" variant="outline" aria-label="Go to page">
          Go
        </Button>
      </form>
    </div>
  );
}

export default Pagination;
