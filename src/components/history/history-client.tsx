"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/fconfig";
import { onAuthStateChanged } from "firebase/auth";
import { NovelCard } from "@/components/audio/novel-card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HistoryClient() {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);

      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch history from localStorage when user is authenticated
      try {
        const historyData = localStorage.getItem(`audio_history_${user.uid}`);
        if (historyData) {
          const parsedHistory = JSON.parse(historyData);
          // Sort by most recent first
          const sortedHistory = parsedHistory.sort(
            (a: any, b: any) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setHistoryItems(sortedHistory);
        }
      } catch (err) {
        console.error("Error loading history:", err);
        setError("Failed to load your listening history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearHistory = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      localStorage.removeItem(`audio_history_${userId}`);
      setHistoryItems([]);
    }
  };

  const removeHistoryItem = (novelId: string) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const updatedHistory = historyItems.filter(
        (item) => item.novel._id !== novelId
      );
      localStorage.setItem(
        `audio_history_${userId}`,
        JSON.stringify(updatedHistory)
      );
      setHistoryItems(updatedHistory);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Sign In to View Your History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You need to be signed in to view and manage your listening history.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Listening History
          </h1>
          {historyItems.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all your listening history. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearHistory}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Yes, clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No History Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start listening to novels and they'll appear here so you can
              easily pick up where you left off.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Discover Novels
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {historyItems.map((item, index) => (
                <motion.div
                  key={`${item.novel._id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative group"
                >
                  <NovelCard novel={item.novel} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => removeHistoryItem(item.novel._id)}
                      aria-label="Remove from history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()} • Chapter{" "}
                    {item.chapter || "N/A"}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
