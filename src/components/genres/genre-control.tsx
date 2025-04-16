"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFilter, FaSort } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface GenreControlsProps {
  genre: string;
  sort: string;
  onSortChange: (value: string) => void;
}

export function GenreControls({
  genre,
  sort,
  onSortChange,
}: GenreControlsProps) {
  const router = useRouter();

  // Sort options
  const sortOptions = [
    { value: "views", label: "Popular" },
    { value: "updatedAt", label: "Recently Updated" },
    { value: "rating", label: "Top Rated" },
  ];

  const handleSortChange = (value: string) => {
    router.push(`/genres/${encodeURIComponent(genre)}?page=1&sort=${value}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Browsing {genre} novels
        </h2>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Sort by:
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-2"
        >
          <option value="views">Popular</option>
          <option value="latest">Latest</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <Button variant="outline" size="sm" className="gap-2">
        <FaFilter className="h-4 w-4" />
        <span>Filters</span>
      </Button>
    </div>
  );
}
