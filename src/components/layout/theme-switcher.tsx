"use client";

import { useTheme } from "@/components/theme-provider";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FaSun className="h-5 w-5 text-yellow-500" />
      ) : (
        <FaMoon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
}
