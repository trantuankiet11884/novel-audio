import Script from "next/script";
import config from "@/config/data";

export default function SchemaScripts() {
  return (
    <>
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
    </>
  );
}
