import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import { Metadata } from "next";
import config from "@/config/data";

export const metadata: Metadata = {
  title: "VIP Subscription | MTL Novel Audio",
  description:
    "Upgrade to VIP and enjoy ad-free novel listening with exclusive benefits. Choose a plan that fits your needs.",
  openGraph: {
    title: "VIP Subscription | MTL Novel Audio",
    description:
      "Upgrade to VIP and enjoy ad-free novel listening with exclusive benefits.",
    url: `${config.siteUrl}/vip`,
    type: "website",
  },
  alternates: {
    canonical: `${config.siteUrl}/vip`,
  },
  keywords: [
    "VIP subscription",
    "ad-free novels",
    "premium novel audio",
    "novel listening subscription",
  ],
};

export default function VIP() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Pro Plan Subscription",
            description:
              "Access Google Integration and enjoy ad-free novel listening",
            offers: {
              "@type": "Offer",
              price: "14.99",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${config.siteUrl}/vip`,
              priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              )
                .toISOString()
                .split("T")[0],
            },
            brand: {
              "@type": "Brand",
              name: config.title,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              bestRating: "5",
              ratingCount: "425",
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="relative z-10 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Unlock Ad-Free Novel Listening
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a plan to enjoy uninterrupted novel listening with
                exclusive benefits.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 max-w-7xl mx-auto">
              {/* Pro Plan */}
              <Card className="relative flex max-w-96 flex-col border-2 border-blue-100 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
                    Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Pro Plan
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Access Google Integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      $14.99
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Ad-free novel listening",
                      "Google account sync",
                      "Priority customer support",
                      "Early access to new features",
                    ].map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <CheckCircle2 className="mr-2 h-5 w-5 text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Choose Pro Plan
                  </Button>
                </CardFooter>
              </Card>

              {/* VIP Plan */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
