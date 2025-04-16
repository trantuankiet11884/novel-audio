"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, ArrowUpDown, Search, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Chapter {
  slug: string;
  title: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  novelSlug: string;
  currentChapterIndex?: number;
  onChapterSelect: (index: number) => void; // New callback prop
}

const CHAPTERS_PER_PAGE = 100;

export default function ChapterList({
  chapters,
  novelSlug,
  currentChapterIndex,
  onChapterSelect,
}: ChapterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleChapters, setVisibleChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil(chapters.length / CHAPTERS_PER_PAGE));
  }, [chapters.length]);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const filterAndSortChapters = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 10));

      try {
        let filtered = chapters;
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          filtered = chapters.filter((chapter) =>
            chapter.title.toLowerCase().includes(lowerSearchTerm)
          );
        }

        const sorted = [...filtered].sort((a, b) => {
          const aMatch =
            a.title.match(/chapter\s+(\d+)/i) || a.title.match(/(\d+)/);
          const bMatch =
            b.title.match(/chapter\s+(\d+)/i) || b.title.match(/(\d+)/);

          const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
          const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;

          if (aNum === bNum) return a.title.localeCompare(b.title);
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        });

        const startIndex = (currentPage - 1) * CHAPTERS_PER_PAGE;
        const paginatedChapters = sorted.slice(
          startIndex,
          startIndex + CHAPTERS_PER_PAGE
        );

        if (isMounted) {
          setVisibleChapters(paginatedChapters);
          setTotalPages(Math.ceil(sorted.length / CHAPTERS_PER_PAGE));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    filterAndSortChapters();

    return () => {
      isMounted = false;
    };
  }, [chapters, searchTerm, sortDirection, currentPage]);

  useEffect(() => {
    if (currentChapterIndex !== undefined && !isLoading) {
      setTimeout(() => {
        const currentChapterRow = document.getElementById(
          `chapter-${currentChapterIndex}`
        );
        if (currentChapterRow) {
          currentChapterRow.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }
  }, [currentChapterIndex, visibleChapters, isLoading]);

  useEffect(() => {
    if (currentChapterIndex !== undefined && chapters.length > 0) {
      const targetPage =
        Math.floor(currentChapterIndex / CHAPTERS_PER_PAGE) + 1;
      setCurrentPage(targetPage);
    }
  }, [currentChapterIndex, chapters.length]);

  const renderPageInfo = () => {
    return (
      <div className="text-sm text-center text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center justify-center gap-2">
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={currentPage} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {Array.from({ length: totalPages }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {renderPageInfo()}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || isLoading}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and sort options */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters..."
            onChange={(e) => debouncedSetSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          onClick={toggleSortDirection}
          className="w-full flex items-center justify-center gap-1"
        >
          Sort {sortDirection === "asc" ? "Oldest First" : "Latest First"}
          <ArrowUpDown className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Chapter table */}
      <div className="border rounded-md max-h-[450px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-full">Chapters</TableHead>
              <TableHead className="w-10">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : visibleChapters.length > 0 ? (
              visibleChapters.map((chapter) => {
                const originalIndex = chapters.findIndex(
                  (c) => c.slug === chapter.slug
                );
                const isCurrentChapter = currentChapterIndex === originalIndex;

                return (
                  <TableRow
                    key={chapter.slug}
                    id={`chapter-${originalIndex}`}
                    className={
                      isCurrentChapter
                        ? "bg-primary/10 dark:bg-primary/20 rounded-md"
                        : ""
                    }
                  >
                    <TableCell className="font-medium py-2.5 pr-0">
                      <button
                        onClick={() => onChapterSelect(originalIndex)}
                        className={`hover:underline text-left cursor-pointer line-clamp-2 ${
                          isCurrentChapter ? "font-bold text-primary" : ""
                        }`}
                      >
                        {chapter.title}
                        {isCurrentChapter && (
                          <span className="ml-1 text-xs bg-primary/20 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right py-2.5 pl-1">
                      <Button
                        variant={isCurrentChapter ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onChapterSelect(originalIndex)}
                        className="h-7 w-7 p-0"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span className="sr-only">
                          Listen to {chapter.title}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-6 text-muted-foreground"
                >
                  No chapters found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {renderPagination()}
    </div>
  );
}
