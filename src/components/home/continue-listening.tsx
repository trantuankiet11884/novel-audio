"use client";

import { useEffect } from "react";

import { auth } from "@/lib/firebase/fconfig";
import { useState } from "react";
import { getHistory } from "@/lib/history/history-utils";
import { NovelCard } from "../audio/novel-card";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "lucide-react";

export function ContinueListeningSection() {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const history = getHistory(user.uid);
      // Only show the most recent 5 items
      setHistoryItems(history.slice(0, 5) as any);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Continue Listening</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (historyItems.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Continue Listening</h2>
        <Link
          href="/history"
          className="flex items-center text-sm text-primary hover:underline font-medium"
        >
          View all <FaChevronRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {historyItems.map((item: any, idx) => (
          <NovelCard
            key={`history-${item.novel?._id || idx}-${idx}`}
            novel={item.novel}
          />
        ))}
      </div>
    </section>
  );
}
