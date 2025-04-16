import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import config from "@/config/data";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-geist-mono",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/logos/logo.svg",
  },
  openGraph: {
    title: config.title,
    description: config.description,
    images: "/logos/logo.svg",
  },
  alternates: {
    canonical: config.siteUrl,
  },
  keywords: config.keywords,
  robots: {
    index: true,
    follow: true,
  },
  authors: {
    name: config.author,
  },
  category: "novels",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            height={3}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
