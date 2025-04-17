"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBook,
  FaHistory,
  FaHome,
  FaLayerGroup,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Theo dõi scroll để thay đổi header style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng drawer khi pathname thay đổi
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navigationItems = [
    { name: "Home", href: "/", icon: <FaHome className="h-4 w-4" /> },
    { name: "Novels", href: "/search", icon: <FaBook className="h-4 w-4" /> },
    {
      name: "Genres",
      href: "/genres",
      icon: <FaLayerGroup className="h-4 w-4" />,
    },
    {
      name: "History",
      href: "/history",
      icon: <FaHistory className="h-4 w-4" />,
    },
  ];

  // Lấy chữ cái đầu tiên của username để hiển thị trong avatar
  const getUserInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm"
          : "bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo và Mobile Menu */}
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FaBars className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetTitle></SheetTitle>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="px-1 py-6 flex flex-col gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <span className="font-bold text-primary">M</span>
                  </motion.div>
                  <span className="font-bold text-xl">MTL Novel Audio</span>
                </Link>

                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                      {item.href === pathname && (
                        <Badge
                          variant="outline"
                          className="ml-auto text-xs font-normal"
                        >
                          Active
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>

                {user ? (
                  <div className="mt-auto space-y-3">
                    <Link
                      href="/vip"
                      className="block w-full"
                      onClick={() => setOpen(false)}
                    >
                      <Button className="w-full" variant="outline">
                        <FaUser className="mr-2 h-4 w-4" />
                        Listen Audio With No Ads
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="mt-auto space-y-3">
                    <Link
                      href="/sign-in"
                      className="block w-full"
                      onClick={() => setOpen(false)}
                    >
                      <Button variant="default" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block w-full"
                      onClick={() => setOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-200"
            >
              <span className="font-bold text-primary">M</span>
            </motion.div>
            <span className="font-bold text-xl group-hover:text-primary transition-colors duration-200">
              MTL Novel Audio
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href} className="group relative">
              <div
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-primary"
                }`}
              >
                {item.name}
              </div>
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                initial={pathname === item.href ? { scaleX: 1 } : { scaleX: 0 }}
                animate={pathname === item.href ? { scaleX: 1 } : { scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-gray-700 dark:text-gray-300"
          >
            <Link href="/search">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </motion.div>
            </Link>
          </Button>

          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={user ? "text-primary bg-primary/10" : ""}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user ? (
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={user.avatar}
                        alt={user.username || "User"}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <FaUser className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar}
                        alt={user.username || "User"}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.username || "User"}
                      </span>
                      <span className="text-xs text-gray-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/user"
                      className="cursor-pointer flex items-center"
                    >
                      <FaUser className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/vip"
                      className="cursor-pointer flex items-center"
                    >
                      <FaBook className="mr-2 h-4 w-4" />
                      Listen Audio With No Ads
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in" className="cursor-pointer">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up" className="cursor-pointer">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
