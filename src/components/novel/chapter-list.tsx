"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Chapter {
  slug: string;
  title: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  novelSlug: string;
  currentChapterIndex?: number;
  onChapterSelect: (index: number) => void;
}

const CHAPTERS_PER_PAGE = 50;

function ChapterList({
  chapters,
  novelSlug,
  currentChapterIndex = 0,
  onChapterSelect,
}: ChapterListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const chapterListRef = useRef<HTMLDivElement>(null); // Tham chiếu đến container danh sách chương

  const totalPages = Math.ceil(chapters.length / CHAPTERS_PER_PAGE);

  const filteredChapters = useMemo(() => {
    let result = [...chapters];
    if (searchQuery) {
      result = result.filter((chapter) =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sortOrder === "asc" ? result : [...result].reverse();
  }, [chapters, searchQuery, sortOrder]);

  const paginatedChapters = useMemo(() => {
    const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE;
    return filteredChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE);
  }, [filteredChapters, currentPage]);

  // Cuộn đến chương hiện tại
  useEffect(() => {
    if (chapterListRef.current && currentChapterIndex >= 0) {
      const currentChapterElement = chapterListRef.current.querySelector(
        `[data-chapter-index="${currentChapterIndex}"]`
      ) as HTMLElement;
      if (currentChapterElement) {
        currentChapterElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // Đặt chương hiện tại ở giữa khung nhìn
        });
      }
    }
  }, [currentChapterIndex, paginatedChapters]);

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
      return;
    }
    if (currentChapterIndex >= 0 && currentChapterIndex < chapters.length) {
      const chapterSlug = chapters[currentChapterIndex].slug;
      const filteredIndex = filteredChapters.findIndex(
        (c) => c.slug === chapterSlug
      );
      if (filteredIndex >= 0) {
        const targetPage = Math.floor(filteredIndex / CHAPTERS_PER_PAGE) + 1;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    }
  }, [currentChapterIndex, chapters, filteredChapters, searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  const handleSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleChapterClick = (index: number) => {
    onChapterSelect(index);
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chapters..."
            className="pl-10 h-10 text-sm rounded-lg border-gray-300 dark:border-gray-700"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="h-10 text-sm rounded-lg border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chapters Display */}
      <div
        ref={chapterListRef}
        className="max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent rounded-lg border border-gray-200 dark:border-gray-800"
      >
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
              <TableRow>
                <TableHead className="w-16 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Ch.
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Title
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChapters.map((chapter) => {
                const globalIndex = chapters.findIndex(
                  (c) => c.slug === chapter.slug
                );
                const isCurrent = globalIndex === currentChapterIndex;
                return (
                  <TableRow
                    key={chapter.slug}
                    data-chapter-index={globalIndex} // Thêm thuộc tính để xác định phần tử
                    className={cn(
                      "transition-colors cursor-pointer text-sm",
                      isCurrent
                        ? "bg-blue-100 dark:bg-blue-900/50 font-semibold"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
                    onClick={() => handleChapterClick(globalIndex)}
                  >
                    <TableCell className="py-3 text-center">
                      {globalIndex + 1}
                    </TableCell>
                    <TableCell className="py-3 truncate">
                      {chapter.title}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-2 p-4">
          {paginatedChapters.map((chapter) => {
            const globalIndex = chapters.findIndex(
              (c) => c.slug === chapter.slug
            );
            const isCurrent = globalIndex === currentChapterIndex;
            return (
              <div
                key={chapter.slug}
                data-chapter-index={globalIndex} // Thêm thuộc tính để xác định phần tử
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                  isCurrent
                    ? "bg-blue-100 dark:bg-blue-900/50 font-semibold border-blue-300 dark:border-blue-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800"
                )}
                onClick={() => handleChapterClick(globalIndex)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Ch. {globalIndex + 1} {isCurrent && "(Current)"}
                  </span>
                  <span className="text-sm truncate flex-1 ml-4">
                    {chapter.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500">
            Showing {paginatedChapters.length} of {filteredChapters.length}{" "}
            chapters
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs h-8 px-3"
            >
              Prev
            </Button>
            <span className="text-xs font-medium">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-xs h-8 px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ChapterList);
