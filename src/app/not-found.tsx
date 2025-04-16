import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-3xl w-full p-4 text-center">
        {/* Animated 404 text */}
        <h1 className="text-[8rem] sm:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">
          404
        </h1>

        {/* Illustration */}
        <div className=" relative">
          <div className="w-48 h-48 mx-auto relative">
            <div className="absolute inset-0 bg-base-300 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error message */}

        <p className="text-base-content/70 text-lg mb-8 max-w-md mx-auto">
          It seems the page you are looking for does not exist or has been moved
          to a different address.
        </p>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn btn-primary btn-lg gap-2 group flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
