"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { NovelCard } from "@/components/audio/novel-card";
import { Novel } from "@/lib/apis/api";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter } from "lucide-react";
import Pagination from "./search-pagination";

interface SearchClientProps {
  initialNovels: Novel[];
  totalNovels: number;
  genres: string[];
  currentPage: number;
  novelsPerPage: number;
}

export default function SearchClient({
  initialNovels,
  totalNovels,
  genres,
  currentPage,
  novelsPerPage,
}: SearchClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("any");
  const [minChapters, setMinChapters] = useState<string>("any");
  const [sortBy, setSortBy] = useState<"views" | "rating" | "updatedAt">(
    "views"
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const allStatuses = useMemo(
    () =>
      Array.from(new Set(initialNovels.map((novel) => novel.status))).sort(),
    [initialNovels]
  );

  const filteredNovels = useMemo(() => {
    let result = [...initialNovels];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (novel) =>
          novel.title.toLowerCase().includes(query) ||
          novel.author.toLowerCase().includes(query)
      );
    }

    if (selectedGenres.length > 0) {
      result = result.filter((novel) =>
        selectedGenres.every((genre) => novel.genres.includes(genre))
      );
    }

    if (selectedStatus !== "all") {
      result = result.filter((novel) => novel.status === selectedStatus);
    }

    if (minRating !== "any") {
      const ratingNum = Number(minRating);
      result = result.filter((novel) => novel.rating >= ratingNum);
    }

    if (minChapters !== "any") {
      const chaptersNum = Number(minChapters);
      result = result.filter((novel) => novel.chapters >= chaptersNum);
    }

    result.sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "updatedAt")
        return Number(b.updatedAt) - Number(a.updatedAt);
      return 0;
    });

    return result;
  }, [
    initialNovels,
    searchQuery,
    selectedGenres,
    selectedStatus,
    minRating,
    minChapters,
    sortBy,
  ]);

  const totalPages = Math.ceil(totalNovels / novelsPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          All Novels
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Find your next favorite story from {totalNovels.toLocaleString()}{" "}
          novels.
        </p>
      </div>

      <div className="sticky top-0 z-10 rounded-md py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by title or author..."
              className="pl-10"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[600px] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Genres</h3>
                  <ScrollArea className="h-40">
                    {genres.map((genre) => (
                      <div
                        key={genre}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          id={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => {
                            setSelectedGenres((prev) =>
                              checked
                                ? [...prev, genre]
                                : prev.filter((g) => g !== genre)
                            );
                          }}
                        />
                        <label
                          htmlFor={genre}
                          className="text-sm text-gray-600 dark:text-gray-300"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {allStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
                    <Select value={minRating} onValueChange={setMinRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Minimum Chapters
                    </h3>
                    <Select value={minChapters} onValueChange={setMinChapters}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="50">50+</SelectItem>
                        <SelectItem value="100">100+</SelectItem>
                        <SelectItem value="500">500+</SelectItem>
                        <SelectItem value="1000">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="updatedAt">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-8">
        {filteredNovels.length === 0 ? (
          <div className="text-center py-12">
            <Image
              src="/no-results.png"
              alt="No results"
              width={200}
              height={200}
              className="mx-auto opacity-50"
            />
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No novels found on this page. Try adjusting your filters or
              changing the page.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedGenres([]);
                setSelectedStatus("all");
                setMinRating("any");
                setMinChapters("any");
                setSortBy("views");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredNovels.map((novel) => (
                <NovelCard key={novel._id} novel={novel} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
