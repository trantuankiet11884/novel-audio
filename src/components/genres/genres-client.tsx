"use client";
import { NovelsGrid } from "@/components/audio/novels-grid";
import { NovelsSkeleton } from "@/components/audio/novels-skeletion";
import { GenrePagination } from "@/components/genres/genre-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fetchNovels } from "@/lib/apis/api";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Filter, Search, X } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";

export function ClientSearch({ genres }: { genres: string[] }) {
  const [search, setSearch] = useState("");
  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-8">
      <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
        <div className="relative max-w-md mx-auto overflow-hidden rounded-full shadow-md transition-all duration-300 focus-within:shadow-purple-300/30 focus-within:ring-2 focus-within:ring-purple-400">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search for a genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full peer pl-11 pr-10 h-11 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-purple-400 transition-all duration-300 rounded-full"
            aria-label="Search genres"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {search && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {filteredGenres.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  No genres match{" "}
                  <span className="font-semibold">"{search}"</span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {filteredGenres.map((genre, index) => (
                  <motion.div
                    key={genre}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                    }}
                    whileHover={{ y: -2, scale: 1.03 }}
                    className="h-full"
                  >
                    <div
                      className="bg-white/90 dark:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-200 h-full rounded-lg overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-700 text-center"
                      onClick={() => {
                        setSearch("");
                        document.dispatchEvent(
                          new CustomEvent("select-genre", { detail: genre })
                        );
                      }}
                    >
                      <div className="p-3">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white capitalize">
                          {genre}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!search && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          <BookOpen className="h-4 w-4 inline-block mr-1 opacity-70" />
          <span>{genres.length} genres available</span>
        </motion.div>
      )}
    </div>
  );
}

export function ClientGenrePage({ genres }: { genres: string[] }) {
  const [selectedGenre, setSelectedGenre] = useState<string>(genres[0] || "");
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("views");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchGenre, setSearchGenre] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const genreListRef = useRef<HTMLDivElement>(null);
  const limit = 20;

  const [currentGenrePage, setCurrentGenrePage] = useState(1);

  const popularGenres = [
    "Fantasy",
    "Romance",
    "Action",
    "Adventure",
    "Sci-fi",
    "Mystery",
    "Horror",
    "Comedy",
  ].filter((g) => genres.includes(g));

  const fictionGenres = genres.filter(
    (g) =>
      !["Biography", "History", "Science", "Philosophy", "Self-help"].includes(
        g
      )
  );

  const nonfictionGenres = genres.filter((g) =>
    ["Biography", "History", "Science", "Philosophy", "Self-help"].includes(g)
  );

  const filterGenresBySearch = (genresList: string[]) => {
    if (!searchGenre) return genresList;
    return genresList.filter((g) =>
      g.toLowerCase().includes(searchGenre.toLowerCase())
    );
  };

  let filteredGenres: string[] = [];
  if (categoryFilter === "all") {
    filteredGenres = filterGenresBySearch(genres);
  } else if (categoryFilter === "popular") {
    filteredGenres = filterGenresBySearch(popularGenres);
  } else if (categoryFilter === "fiction") {
    filteredGenres = filterGenresBySearch(fictionGenres);
  } else if (categoryFilter === "nonfiction") {
    filteredGenres = filterGenresBySearch(nonfictionGenres);
  }

  useEffect(() => {
    setCurrentGenrePage(1);
  }, [categoryFilter, searchGenre]);

  useEffect(() => {
    const handleSelectGenre = (e: CustomEvent) => {
      handleGenreClick(e.detail);
    };

    document.addEventListener(
      "select-genre",
      handleSelectGenre as EventListener
    );
    return () => {
      document.removeEventListener(
        "select-genre",
        handleSelectGenre as EventListener
      );
    };
  }, []);

  useEffect(() => {
    async function loadNovels() {
      if (!selectedGenre) return;

      setLoading(true);
      try {
        const skip = (page - 1) * limit;
        const novelsData = await fetchNovels({
          genre: selectedGenre,
          sort,
          skip,
        });
        setNovels(novelsData.novels as any);
        setTotal(novelsData.total);
      } catch (error) {
        console.error("Error loading novels:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNovels();
  }, [selectedGenre, page, sort]);

  const totalPages = Math.ceil(total / limit);

  const handleGenreClick = (genre: string | SetStateAction<null>) => {
    setSelectedGenre(genre as string);
    setPage(1);
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (newPage: SetStateAction<number>) => {
    setPage(newPage);
    document
      .getElementById("novels-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSortChange = (newSort: SetStateAction<string>) => {
    setSort(newSort);
    setPage(1);
  };

  const renderGenresList = () => (
    <div className="space-y-4">
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant={categoryFilter === "all" ? "default" : "outline"}
          className="cursor-pointer text-sm px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setCategoryFilter("all");
          }}
        >
          All Genres
        </Badge>
        <Badge
          variant={categoryFilter === "popular" ? "default" : "outline"}
          className="cursor-pointer text-sm px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setCategoryFilter("popular");
          }}
        >
          Popular
        </Badge>
        <Badge
          variant={categoryFilter === "fiction" ? "default" : "outline"}
          className="cursor-pointer text-sm px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setCategoryFilter("fiction");
          }}
        >
          Fiction
        </Badge>
        <Badge
          variant={categoryFilter === "nonfiction" ? "default" : "outline"}
          className="cursor-pointer text-sm px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setCategoryFilter("nonfiction")}
        >
          Non-Fiction
        </Badge>
      </div>

      {/* Genre search bar */}
      <div className="relative max-w-full mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
          size={16}
        />
        <Input
          type="text"
          placeholder="Filter genres..."
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
          className="pl-9 pr-4 h-9 text-sm bg-white/95 dark:bg-gray-800/95 w-full"
        />
        {searchGenre && (
          <button
            type="button"
            onClick={() => setSearchGenre("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Genre list */}
      <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {filteredGenres.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              No genres found matching your search.
            </p>
          </div>
        ) : (
          filteredGenres.map((genre) => (
            <div
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-3 py-2 rounded-md cursor-pointer transition-all ${
                selectedGenre === genre
                  ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-700 dark:text-purple-300 font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="capitalize">{genre}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile drawer trigger */}
        <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
              {selectedGenre}
            </h2>
            {total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {total.toLocaleString()} novels
              </Badge>
            )}
          </div>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="ml-auto"
                aria-label="Filter genres"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md p-2">
              <div className="h-full py-4 overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Browse Genres
                </h3>
                {renderGenresList()}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar for genres */}
        <div
          className="hidden lg:block w-1/4 p-5 border-r border-gray-200 dark:border-gray-700 sticky top-20 self-start max-h-[calc(100vh-160px)] overflow-y-hidden"
          ref={genreListRef}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Browse Genres
          </h3>
          {renderGenresList()}
        </div>

        {/* Novels section */}
        <div className="lg:w-3/4 p-4 lg:p-6" id="novels-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="hidden lg:flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {selectedGenre}
              </h2>
              {total > 0 && (
                <Badge variant="secondary">
                  {total.toLocaleString()} novels
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm rounded-md border border-gray-200 dark:border-gray-600 p-1.5"
              >
                <option value="views">Most Popular</option>
                <option value="latest">Latest Additions</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NovelsSkeleton />
              </motion.div>
            ) : novels.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  No novels found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  We couldn't find any {selectedGenre} novels. Try another genre
                  or check back later.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="novels"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NovelsGrid novels={novels} />
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700"
            >
              <GenrePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                genre={selectedGenre}
                sort={sort}
                inlinePagination={true}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
