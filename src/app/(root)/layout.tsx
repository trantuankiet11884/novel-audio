import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AuthProvider } from "@/contexts/auth";
import config from "@/config/data";
import Script from "next/script";
import { BackToTop } from "@/components/back-to-top";
import { Suspense } from "react";
import { HomeSkeleton } from "@/components/home/home-skeleton";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Script
        id="schema-organization"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: config.title,
          url: config.siteUrl,
          logo: `${config.siteUrl}/images/logos/logo.svg`,
          sameAs: [
            config.twitterHandle,
            config.facebookPage,
            config.instagramHandle,
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English"],
          },
        })}
      </Script>

      <Script
        id="schema-website"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: config.title,
          url: config.siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${config.siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        })}
      </Script>

      <AuthProvider>
        <Header />
        <main className="flex-1">
          <Suspense fallback={<HomeSkeleton />}>{children}</Suspense>
        </main>
        <Footer />
        <BackToTop />
      </AuthProvider>
    </div>
  );
};

export default ClientLayout;
