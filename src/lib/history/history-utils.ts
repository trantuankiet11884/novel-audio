/**
 * Utilities for managing audio history
 */

import { Novel } from "../apis/api";

interface HistoryItem {
  novel: Novel;
  timestamp: string;
  duration?: number;
  progress?: number;
  chapter?: number;
}

/**
 * Add a novel to the user's listening history
 */
export function addToHistory(
  userId: string,
  novel: Novel,
  progress?: number,
  chapter?: number
) {
  if (!userId || !novel) return;

  try {
    // Get existing history
    const historyKey = `audio_history_${userId}`;
    const existingHistory = localStorage.getItem(historyKey);
    let historyItems: HistoryItem[] = existingHistory
      ? JSON.parse(existingHistory)
      : [];

    // Check if this novel is already in history
    const existingIndex = historyItems.findIndex(
      (item) => item.novel._id === novel._id
    );

    const historyItem: HistoryItem = {
      novel,
      timestamp: new Date().toISOString(),
      progress,
      chapter,
    };

    if (existingIndex >= 0) {
      // Update existing entry
      historyItems[existingIndex] = historyItem;
    } else {
      // Add new entry
      historyItems.push(historyItem);
    }

    // Limit history to 100 items
    if (historyItems.length > 100) {
      historyItems = historyItems.slice(-100);
    }

    // Save updated history
    localStorage.setItem(historyKey, JSON.stringify(historyItems));
  } catch (error) {
    console.error("Error saving to history:", error);
  }
}

/**
 * Get user's listening history
 */
export function getHistory(userId: string): HistoryItem[] {
  if (!userId) return [];

  try {
    const historyKey = `audio_history_${userId}`;
    const existingHistory = localStorage.getItem(historyKey);
    return existingHistory ? JSON.parse(existingHistory) : [];
  } catch (error) {
    console.error("Error retrieving history:", error);
    return [];
  }
}

/**
 * Clear all history for a user
 */
export function clearHistory(userId: string): boolean {
  if (!userId) return false;

  try {
    localStorage.removeItem(`audio_history_${userId}`);
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
}

/**
 * Remove a single item from history
 */
export function removeFromHistory(userId: string, novelId: string): boolean {
  if (!userId || !novelId) return false;

  try {
    const historyKey = `audio_history_${userId}`;
    const existingHistory = localStorage.getItem(historyKey);

    if (!existingHistory) return false;

    const historyItems: HistoryItem[] = JSON.parse(existingHistory);
    const updatedHistory = historyItems.filter(
      (item) => item.novel._id !== novelId
    );

    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error("Error removing from history:", error);
    return false;
  }
}
