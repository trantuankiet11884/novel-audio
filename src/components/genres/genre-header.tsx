import { Badge } from "@/components/ui/badge";
import { FaBookOpen } from "react-icons/fa";

interface GenreHeaderProps {
  genre: string;
  total: number;
}

export function GenreHeader({ genre, total }: GenreHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FaBookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight capitalize">
          {genre} Novels
        </h1>
        <Badge variant="outline" className="ml-2 text-sm">
          {total} titles
        </Badge>
      </div>

      <p className="text-muted-foreground">
        Explore our collection of {genre} novels, from popular favorites to
        hidden gems.
      </p>
    </header>
  );
}
