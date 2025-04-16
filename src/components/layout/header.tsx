"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaSearch, FaUser } from "react-icons/fa";
import { ThemeSwitcher } from "./theme-switcher";
import { useAuth } from "@/contexts/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Novels", href: "/search" },
    { name: "Genres", href: "/genres" },
    { name: "History", href: "/history" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <FaBars className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold md:text-xl text-lg">
              MTL Novel Audio
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Search"
          >
            <FaSearch className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={user ? "User menu" : "Sign in"}
              >
                <FaUser className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    {user.username || user.email || "User"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/user">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/vip">Listen Audio With No Ads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2 py-1.5 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-800 text-primary"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-md text-sm font-medium text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    <Link href="/vip">Listen Audio With No Ads</Link>
                  </button>

                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-md text-sm font-medium text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className={`px-2 py-1.5 rounded-md text-sm font-medium ${
                      pathname === "/sign-in"
                        ? "bg-gray-100 dark:bg-gray-800 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className={`px-2 py-1.5 rounded-md text-sm font-medium ${
                      pathname === "/sign-up"
                        ? "bg-gray-100 dark:bg-gray-800 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
