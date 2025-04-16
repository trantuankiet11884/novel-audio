import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("en");

export const fallbackImage = "/images/fallback.png";

export const formatTimeAgo = (timestamp: number) => {
  return dayjs(timestamp * 1000).fromNow();
};

export function sortChapters(chapters: { title: string; slug: string }[]) {
  // Helper to convert Roman numerals to integers
  const romanToInt = (str: string): number => {
    const romanMap: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let result = 0;
    let prevValue = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      const currValue = romanMap[str[i].toUpperCase()];
      if (!currValue) return NaN; // Invalid Roman numeral
      if (currValue >= prevValue) {
        result += currValue;
      } else {
        result -= currValue;
      }
      prevValue = currValue;
    }
    return result;
  };

  // Helper to extract chapter number and type
  const parseChapter = (
    title: string
  ): { type: string; number: number | null; original: string } => {
    const normalizedTitle = title.trim().toLowerCase();

    // Handle special chapters
    if (normalizedTitle.includes("prologue")) {
      return { type: "prologue", number: null, original: title };
    }
    if (normalizedTitle.includes("epilogue")) {
      return { type: "epilogue", number: null, original: title };
    }
    if (
      normalizedTitle.includes("author’s note") ||
      normalizedTitle.includes("after chapter")
    ) {
      // Extract number if present (e.g., "After Chapter 257")
      const afterMatch = normalizedTitle.match(/after chapter (\d+)/i);
      return {
        type: "note",
        number: afterMatch ? parseInt(afterMatch[1], 10) : null,
        original: title,
      };
    }
    if (
      normalizedTitle.includes("introduction") ||
      normalizedTitle.includes("intro")
    ) {
      return { type: "intro", number: null, original: title };
    }
    if (normalizedTitle.includes("bonus")) {
      return { type: "bonus", number: null, original: title };
    }

    // Extract chapter number
    const patterns = [
      /chapter (\d+\.?\d*)/i, // e.g., "Chapter 12", "Chapter 12.5"
      /ch\. (\d+\.?\d*)/i, // e.g., "Ch. 12", "Ch. 12.5"
      /episode (\d+\.?\d*)/i, // e.g., "Episode 12"
      /part (\d+\.?\d*)/i, // e.g., "Part 12"
      /volume \d+ chapter (\d+\.?\d*)/i, // e.g., "Volume 1 Chapter 12"
      /chapter ([ivxlcdm]+)/i, // Roman numerals, e.g., "Chapter IV"
      /is chapter (\d+)/i, // e.g., "Is Chapter 16 still unfinished?"
    ];

    for (const pattern of patterns) {
      const match = normalizedTitle.match(pattern);
      if (match) {
        const numStr = match[1];
        let number: number;
        if (/[ivxlcdm]+/i.test(numStr)) {
          // Roman numeral
          number = romanToInt(numStr);
          if (isNaN(number)) {
            return { type: "chapter", number: null, original: title };
          }
        } else {
          // Decimal or integer
          number = parseFloat(numStr);
        }
        return { type: "chapter", number, original: title };
      }
    }

    // Fallback for unrecognized formats
    return { type: "unknown", number: null, original: title };
  };

  // Sort chapters
  return chapters.sort((a, b) => {
    const parsedA = parseChapter(a.title);
    const parsedB = parseChapter(b.title);

    // Define type priorities
    const typePriority: { [key: string]: number } = {
      prologue: 0,
      intro: 1,
      chapter: 2,
      bonus: 3,
      note: 4,
      epilogue: 5,
      unknown: 6,
    };

    // Compare by type first
    const typeDiff = typePriority[parsedA.type] - typePriority[parsedB.type];
    if (typeDiff !== 0) {
      return typeDiff;
    }

    // If same type, compare by number
    if (parsedA.number !== null && parsedB.number !== null) {
      return parsedA.number - parsedB.number;
    }

    // If one has a number and the other doesn’t
    if (parsedA.number !== null) return -1;
    if (parsedB.number !== null) return 1;

    // If both have no number, sort alphabetically by original title
    return parsedA.original.localeCompare(parsedB.original);
  });
}
