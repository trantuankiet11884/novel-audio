"use client";

import { Button } from "@/components/ui/button";
import { getBookMark, postBookMark } from "@/lib/apis/api";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NovelBookmarkButtonProps {
  novelId: string;
}

export function NovelBookmarkButton({ novelId }: NovelBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const bookmarks = await getBookMark();
        if (bookmarks && bookmarks[novelId]) {
          setIsBookmarked(bookmarks[novelId].bookmark);
        }
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [novelId]);

  const handleToggleBookmark = async () => {
    try {
      setIsLoading(true);
      await postBookMark(novelId, "bookmark", !isBookmarked);
      setIsBookmarked(!isBookmarked);

      toast.success(
        isBookmarked
          ? "Novel removed from bookmarks"
          : "Novel added to bookmarks"
      );
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      variant="outline"
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`${
        isBookmarked
          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
          : "bg-transparent hover:bg-gray-800 text-white border-gray-600"
      } transition-colors`}
    >
      {isBookmarked ? (
        <BookmarkCheck className="mr-2 h-5 w-5" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    </Button>
  );
}
