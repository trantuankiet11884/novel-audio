"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Novel {
  title: string;
  [key: string]: any;
}

export default function NovelSearch({
  novels,
  genre,
}: {
  novels: Novel[];
  genre: string;
}) {
  const [search, setSearch] = useState("");

  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={`Search in ${genre}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredNovels.map((novel) => (
          <div key={novel.title} className="border rounded-lg p-4">
            {novel.title}
          </div>
        ))}
      </div>
    </div>
  );
}
