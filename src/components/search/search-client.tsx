"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { fetchGenres } from "@/lib/apis/api";
import { BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [genres, setGenres] = useState<string[]>([]);

  // Get values from URL params or set defaults
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || ""
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "views");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minChapters, setMinChapters] = useState(
    searchParams.get("chapters") || ""
  );

  useEffect(() => {
    const loadGenres = async () => {
      const { genres: fetchedGenres } = await fetchGenres({ limit: 100 });
      setGenres(fetchedGenres);
    };

    loadGenres();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (selectedGenre && selectedGenre !== "all")
      params.set("genre", selectedGenre);
    if (sort) params.set("sort", sort);
    if (status) params.set("status", status);
    if (minChapters) params.set("chapters", minChapters);

    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedGenre("all");
    setSort("views");
    setStatus("");
    setMinChapters("");
    router.push("/search");
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Search Filters</h3>
        </div>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            placeholder="Search for novel title, author..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="genre">Genre</Label>
          <Select
            value={selectedGenre || "fantasy"}
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger className="w-full" id="genre">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <RadioGroup
            value={status}
            onValueChange={setStatus}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="status-all" />
              <Label htmlFor="status-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="status-completed" />
              <Label htmlFor="status-completed">Completed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ongoing" id="status-ongoing" />
              <Label htmlFor="status-ongoing">Ongoing</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full" id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="views">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="time_new_chapter">Latest Update</SelectItem>
              <SelectItem value="chapters">Number of Chapters</SelectItem>
              <SelectItem value="created">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button className="w-full" onClick={handleSearch}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
