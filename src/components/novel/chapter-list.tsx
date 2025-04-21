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

const CHAPTERS_PER_PAGE = 15;

function ChapterList({
  chapters,
  novelSlug,
  currentChapterIndex = 0,
  onChapterSelect,
}: ChapterListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const currentChapterRef = useRef<HTMLTableRowElement | HTMLDivElement>(null);

  // Calculate total pages
  const totalPages = Math.ceil(chapters.length / CHAPTERS_PER_PAGE);

  // Filter and sort chapters
  const filteredChapters = useMemo(() => {
    let result = [...chapters];
    if (searchQuery) {
      result = result.filter((chapter) =>
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return sortOrder === "asc" ? result : result.reverse();
  }, [chapters, searchQuery, sortOrder]);

  // Get chapters for current page
  const paginatedChapters = useMemo(() => {
    const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE;
    return filteredChapters.slice(startIndex, startIndex + CHAPTERS_PER_PAGE);
  }, [filteredChapters, currentPage]);

  // Auto-scroll to current chapter
  useEffect(() => {
    // Only attempt to scroll if not searching and after component has fully rendered
    if (currentChapterRef.current && !searchQuery) {
      // Small timeout to ensure DOM is fully updated
      setTimeout(() => {
        currentChapterRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [currentChapterIndex, searchQuery, currentPage]);

  useEffect(() => {
    if (searchQuery) return;
    if (currentChapterIndex >= 0 && currentChapterIndex < chapters.length) {
      const targetPage =
        Math.floor(currentChapterIndex / CHAPTERS_PER_PAGE) + 1;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }
    }
  }, [currentChapterIndex, chapters.length, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleChapterClick = (index: number) => {
    onChapterSelect(index);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chapters..."
            className="pl-8 text-sm"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="md:w-full lg:w-full w-[140px] text-sm">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chapters Display */}
      <div className="hidden md:block lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Chapter</TableHead>
              <TableHead>Title</TableHead>
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
                  ref={
                    isCurrent
                      ? (currentChapterRef as React.RefObject<HTMLTableRowElement>)
                      : null
                  }
                  className={cn(
                    "transition-colors cursor-pointer",
                    isCurrent
                      ? "bg-blue-100 dark:bg-blue-900/50 font-semibold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                  onClick={() => handleChapterClick(globalIndex)}
                >
                  <TableCell>{globalIndex + 1}</TableCell>
                  <TableCell>{chapter.title}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden lg:hidden block space-y-2">
        {paginatedChapters.map((chapter) => {
          const globalIndex = chapters.findIndex(
            (c) => c.slug === chapter.slug
          );
          const isCurrent = globalIndex === currentChapterIndex;
          return (
            <div
              key={chapter.slug}
              ref={
                isCurrent
                  ? (currentChapterRef as React.RefObject<HTMLDivElement>)
                  : null
              }
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                isCurrent
                  ? "bg-blue-100 dark:bg-blue-900/50 font-semibold"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
              onClick={() => handleChapterClick(globalIndex)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Ch. {globalIndex + 1}
                </span>
                <span className="text-sm truncate flex-1 ml-2">
                  {chapter.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {paginatedChapters.length} of {filteredChapters.length}{" "}
            chapters
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-xs px-3"
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-xs px-3"
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
