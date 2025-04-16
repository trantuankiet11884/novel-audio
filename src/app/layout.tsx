import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import config from "@/config/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <ThemeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div> 
           <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
