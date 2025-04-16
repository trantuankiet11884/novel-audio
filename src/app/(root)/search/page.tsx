import { SearchClient } from "@/components/search/search-client";
import { SearchResults } from "@/components/search/search-result";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Novels</h1>
        <p className="text-muted-foreground mt-2">
          Find your next favorite novel using the filters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Suspense>
              <SearchClient />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Suspense>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
