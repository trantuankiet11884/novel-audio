"use client";

import { NovelCardSkeleton } from "@/components/novel/novel-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { fetchNovels, Novel } from "@/lib/apis/api";
import { BoxIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { NovelCard } from "../audio/novel-card";

export function SearchResults() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [novels, setNovels] = useState<Novel[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    hasNext: false,
    hasPrev: false,
    totalPages: 0,
  });
  const [goToPage, setGoToPage] = useState("");

  // Get search params
  const keyword = searchParams.get("keyword") || "";
  const genre = searchParams.get("genre") || "";
  const sort = searchParams.get("sort") || "views";
  const status = searchParams.get("status") || "";
  const chapters = searchParams.get("chapters") || "";
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!)
    : 1;

  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      const limit = 18;
      const skip = (page - 1) * limit;

      const {
        novels: fetchedNovels,
        total,
        hasNext,
        hasPrev,
        totalPages,
      } = await fetchNovels({
        keyword,
        genre: genre === "all" ? "" : genre,
        sort,
        status,
        chapters,
        limit,
        skip,
        page,
      });

      setNovels(fetchedNovels);
      setPagination({ total, page, hasNext, hasPrev, totalPages });
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, genre, sort, status, chapters, page]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  // Function to update URL without navigation
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Validate page number
      if (newPage < 1 || newPage > pagination.totalPages) return;

      // Update URL without navigation
      const queryString = createQueryString("page", newPage.toString());

      // Update URL without causing a page navigation
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [pathname, router, createQueryString, pagination.totalPages]
  );

  const handleGoToPage = useCallback(() => {
    const pageNumber = parseInt(goToPage);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= pagination.totalPages
    ) {
      handlePageChange(pageNumber);
      setGoToPage("");
    }
  }, [goToPage, pagination.totalPages, handlePageChange]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <NovelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <BoxIcon className="size-16 text-muted-foreground" />
        <h3 className="text-xl font-medium">No novels found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search filters or try a different keyword to find
          what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Found {pagination.total.toLocaleString()} novel
          {+pagination.total.toLocaleString() !== 1 ? "s" : ""}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {novels.map((novel) => (
          <NovelCard key={novel._id} novel={novel} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex flex-col gap-4 items-center">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrev && (
                <PaginationItem>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1"
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                </PaginationItem>
              )}

              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => {
                  let pageNumber;

                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNumber = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNumber = pagination.totalPages - 4 + i;
                  } else {
                    pageNumber = pagination.page - 2 + i;
                  }

                  return (
                    <PaginationItem key={i}>
                      <button
                        onClick={() => handlePageChange(pageNumber)}
                        className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10
                        ${
                          pageNumber === pagination.page
                            ? "bg-primary text-primary-foreground"
                            : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </PaginationItem>
                  );
                }
              )}

              {pagination.totalPages > 5 &&
                pagination.page < pagination.totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <button
                        onClick={() => handlePageChange(pagination.totalPages)}
                        className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                      >
                        {pagination.totalPages}
                      </button>
                    </PaginationItem>
                  </>
                )}

              {pagination.hasNext && (
                <PaginationItem>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1"
                  >
                    Next
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="w-16 h-8"
                min={1}
                max={pagination.totalPages}
                placeholder="Go to"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGoToPage();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToPage}
                disabled={
                  !goToPage ||
                  isNaN(parseInt(goToPage)) ||
                  parseInt(goToPage) < 1 ||
                  parseInt(goToPage) > pagination.totalPages
                }
              >
                Go
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
