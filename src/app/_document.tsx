import config from "@/config/data";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={config.language}>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* SEO Meta Tags */}
          <meta name="description" content={config.description} />
          <meta name="author" content={config.author} />
          <meta name="robots" content="index, follow" />
          <meta
            name="keywords"
            content="novel audio, listen to novels, audio books, mtl novel, translated novels"
          />

          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={config.title} />
          <meta property="og:description" content={config.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={config.siteUrl} />
          <meta property="og:site_name" content={config.site_name} />
          <meta
            property="og:image"
            content={`${config.siteUrl}/images/og-image.jpg`}
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={config.title} />
          <meta name="twitter:description" content={config.description} />
          <meta
            name="twitter:image"
            content={`${config.siteUrl}/images/twitter-image.jpg`}
          />
          <meta name="twitter:creator" content="@mtlnovelaudio" />

          {/* Favicon and Touch Icons */}
          <link rel="icon" href={config.favIcon} type="image/svg+xml" />
          <link
            rel="apple-touch-icon"
            href="/images/logos/touch-icon-iphone.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/images/logos/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/logos/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/images/logos/touch-icon-ipad-retina.png"
          />

          {/* JSON-LD Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: config.title,
                url: config.siteUrl,
                logo: `${config.siteUrl}/images/logos/logo.svg`,
                sameAs: [
                  "https://twitter.com/mtlnovelaudio",
                  "https://facebook.com/mtlnovelaudio",
                  "https://instagram.com/mtlnovelaudio",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+1-xxx-xxx-xxxx",
                  contactType: "customer service",
                  availableLanguage: ["English"],
                },
              }),
            }}
          />

          {/* Canonical URL */}
          <link rel="canonical" href={config.siteUrl} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
