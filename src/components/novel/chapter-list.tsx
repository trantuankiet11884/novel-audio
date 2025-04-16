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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>

        <Select
          value={currentPage.toString()}
          onValueChange={(value) => setCurrentPage(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={currentPage} />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
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
          className="flex items-center gap-1"
        >
          Sort {sortDirection === "asc" ? "1 → Latest" : "Latest → 1"}
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-md max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead scope="col">Chapters</TableHead>
              <TableHead scope="col" className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-12">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading chapters...</span>
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
                    <TableCell className="font-medium">
                      <button
                        onClick={() => onChapterSelect(originalIndex)}
                        className={`hover:underline text-left cursor-pointer ${
                          isCurrentChapter ? "font-bold text-primary" : ""
                        }`}
                      >
                        {chapter.title}
                        {isCurrentChapter && " (Current)"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isCurrentChapter ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onChapterSelect(originalIndex)}
                      >
                        <Play className="h-4 w-4" />
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
