import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import config from "@/config/data";

export const metadata: Metadata = {
  title: "Privacy Policy | MTL Novel Audio",
  description:
    "Privacy Policy for MTL Novel Audio application. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | MTL Novel Audio",
    description:
      "Privacy Policy for MTL Novel Audio application. Learn how we collect, use, and protect your personal information.",
    url: `${config.siteUrl}/privacy-policy`,
    type: "website",
  },
  alternates: {
    canonical: `${config.siteUrl}/privacy-policy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "Privacy Policy for MTL Novel Audio application",
            url: `${config.siteUrl}/privacy-policy`,
            mainEntity: {
              "@type": "WebContent",
              headline: "Privacy Policy for Audio Novel Full Reader",
              dateModified: new Date().toISOString(),
            },
          }),
        }}
      />
      <div className="container max-w-4xl py-12 mx-auto">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-center scroll-m-20">
              Privacy Policy for Audio Novel Full Reader
            </h1>
            <Separator className="my-6" />
          </div>

          <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
            <p className="leading-7 text-muted-foreground">
              At Audio Novel Full Reader, one of our main priorities is the
              privacy of our visitors. This Privacy Policy document contains
              types of information that is collected and recorded by Audio Novel
              Full Reader and how we use it.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              If you have additional questions or require more information about
              our Privacy Policy, do not hesitate to contact us.
            </p>
          </Card>

          <section className="space-y-4">
            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Log Files
              </h2>
              <p className="leading-7 text-muted-foreground">
                Audio Novel Full Reader follows a standard procedure of using
                log files. These files log visitors when they use app. The
                information collected by log files include internet protocol
                (IP) addresses, browser type, Internet Service Provider (ISP),
                date and time stamp, referring/exit pages, and possibly the
                number of clicks. These are not linked to any information that
                is personally identifiable. The purpose of the information is
                for analyzing trends, administering the app, tracking users'
                movement on the app, and gathering demographic information.
              </p>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Our Advertising Partners
              </h2>
              <p className="leading-7 text-muted-foreground">
                Some of advertisers in our app may use cookies and web beacons.
                Our advertising partners are listed below. Each of our
                advertising partners has their own Privacy Policy for their
                policies on user data. For easier access, we hyperlinked to
                their Privacy Policies below.
              </p>
              <ul className="mt-4 ml-6 list-disc [&>li]:mt-2">
                <li>
                  <p className="font-medium">Google</p>
                  <a
                    href="https://policies.google.com/technologies/ads"
                    className="text-primary hover:underline"
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                </li>
              </ul>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Privacy Policies
              </h2>
              <p className="leading-7 text-muted-foreground">
                You may consult this list to find the Privacy Policy for each of
                the advertising partners of Audio Novel Full Reader.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                Third-party ad servers or ad networks uses technologies like
                cookies, JavaScript, or Beacons that are used in their
                respective advertisements and links that appear on Audio Novel
                Full Reader. They automatically receive your IP address when
                this occurs. These technologies are used to measure the
                effectiveness of their advertising campaigns and/or to
                personalize the advertising content that you see on this app or
                other apps or websites.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                Note that Audio Novel Full Reader has no access to or control
                over these cookies that are used by third-party advertisers.
              </p>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Third Party Privacy Policies
              </h2>
              <p className="leading-7 text-muted-foreground">
                Audio Novel Full Reader's Privacy Policy does not apply to other
                advertisers or websites. Thus, we are advising you to consult
                the respective Privacy Policies of these third-party ad servers
                for more detailed information. It may include their practices
                and instructions about how to opt-out of certain options.
              </p>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Children's Information
              </h2>
              <p className="leading-7 text-muted-foreground">
                Another part of our priority is adding protection for children
                while using the internet. We encourage parents and guardians to
                observe, participate in, and/or monitor and guide their online
                activity.
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                Audio Novel Full Reader does not knowingly collect any Personal
                Identifiable Information from children under the age of 13. If
                you think that your child provided this kind of information on
                our App, we strongly encourage you to contact us immediately and
                we will do our best efforts to promptly remove such information
                from our records.
              </p>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Online Privacy Policy Only
              </h2>
              <p className="leading-7 text-muted-foreground">
                This Privacy Policy applies only to our online activities and is
                valid for visitors to our App with regards to the information
                that they shared and/or collect in Audio Novel Full Reader. This
                policy is not applicable to any information collected offline or
                via channels other than this app. Our Privacy Policy was created
                with the help of the{" "}
                <a
                  href="https://www.app-privacy-policy.com/app-privacy-policy-generator/"
                  className="text-primary hover:underline"
                >
                  App Privacy Policy Generator from App-Privacy-Policy.com
                </a>
              </p>
            </Card>

            <Card className="p-6 transition-all border shadow-md hover:shadow-lg">
              <h2 className="pb-2 text-2xl font-semibold tracking-tight scroll-m-20">
                Consent
              </h2>
              <p className="leading-7 text-muted-foreground">
                By using our app, you hereby consent to our Privacy Policy and
                agree to its Terms and Conditions.
              </p>
            </Card>
          </section>

          <div className="flex justify-center pt-6">
            <p className="text-sm text-center text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
