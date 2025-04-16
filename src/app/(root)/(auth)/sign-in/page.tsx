"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/lib/firebase/fconfig";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setAlert({ type: "error", message: "Please fill all fields" });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setAlert({ type: "success", message: "Logged in successfully" });
      setTimeout(() => {
        const path = localStorage.getItem("path") || "/";
        router.push(path);
      }, 1000);
    } catch (error: any) {
      let message = "An error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
          message = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
      }
      setAlert({ type: "error", message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key="signin-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in to enjoy your favorite audio novels.
          </p>

          <form onSubmit={handleSignIn} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  ref={emailInputRef}
                  aria-describedby="email-error"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  aria-describedby="password-error"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {alert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Alert
                    variant={
                      alert.type === "success" ? "default" : "destructive"
                    }
                    className="w-full relative px-6 py-4"
                  >
                    <AlertTitle className="text-base font-semibold pr-10">
                      {alert.type === "success" ? "Success" : "Error"}
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {alert.message}
                    </AlertDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAlert(null)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      aria-label="Dismiss alert"
                    >
                      <X size={16} />
                    </Button>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 space-y-2 sm:space-y-0">
            <Link
              href="/forgot-password"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:underline"
              aria-label="Forgot your password?"
            >
              Forgot Password?
            </Link>
            <p>
              No account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                aria-label="Sign up for a new account"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
