"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  FaCheckCircle,
  FaCrown,
  FaLock,
  FaRegCalendarAlt,
  FaRegCalendarCheck,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";

export default function ProPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [paymentSuccess, setPaymentSuccess] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPlan, setCurrentPlan] = useState<"monthly" | "yearly" | null>(
    null
  );

  const plans = {
    monthly: {
      title: "Pro Plan - Access Google",
      price: 14.99,
      priceString: "$14.99",
      originalPrice: null,
      period: "month",
      features: [
        " 01 Voice: Google",
        "No Ads",
        "Access to all basic features of the app.",
      ],
      discount: null,
      billingCycle: "Monthly billing",
      icon: <FaRegCalendarAlt className="h-5 w-5" />,
    },
    yearly: {
      title: "VIP Plan - Unlimited All Access",
      price: 125.88,
      priceString: "$125.88",
      originalPrice: "$179.83",
      period: "year",
      features: [
        "All Voices: Unlimited All Access",
        "No Ads",
        "Download offline",
        "Request new novels",
        "Dedicated server speed load audio",
      ],
      discount: "Save 30%",
      billingCycle: "Annual billing",
      icon: <FaRegCalendarCheck className="h-5 w-5" />,
    },
  };

  const handleCreateOrder =
    (plan: "monthly" | "yearly") => (_data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            description: plans[plan].title,
            amount: {
              currency_code: "USD",
              value: plans[plan].price.toString(),
            },
          },
        ],
      });
    };

  const handleApprove =
    (plan: "monthly" | "yearly") => (_data: any, actions: any) => {
      setIsProcessing((prev) => ({ ...prev, [plan]: true }));
      return actions.order.capture().then(function (details: any) {
        setIsProcessing((prev) => ({ ...prev, [plan]: false }));
        setPaymentSuccess((prev) => ({ ...prev, [plan]: true }));
        setCurrentPlan(plan);
        console.log("Payment completed by " + details.payer.name.given_name);
      });
    };

  if (currentPlan && paymentSuccess[currentPlan]) {
    return <PaymentSuccessScreen planName={plans[currentPlan].title} />;
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Upgrade to Pro</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock premium features and enjoy an enhanced reading experience with
          our Pro plan.
        </p>
      </div>

      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        }}
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-4">
          {/* Monthly Plan Card */}
          <Card
            className={`relative overflow-hidden transition-all ${
              selectedPlan === "monthly"
                ? "border-primary shadow-lg scale-105"
                : "hover:border-primary/50 hover:shadow-md"
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {plans.monthly.icon}
                  <CardTitle>{plans.monthly.title}</CardTitle>
                </div>
                <FaCrown
                  className={`h-6 w-6 ${
                    selectedPlan === "monthly"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <CardDescription>{plans.monthly.billingCycle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center">
                <p className="text-4xl font-bold">
                  {plans.monthly.priceString}/{" "}
                </p>
                <p className="text-xs text-muted-foreground">
                  {plans.monthly.period}
                </p>
              </div>
              <ul className="space-y-2">
                {plans.monthly.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                {isProcessing.monthly ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processing...</p>
                  </div>
                ) : (
                  <PayPalButtons
                    style={{
                      color: "blue",
                      shape: "pill",
                      label: "pay",
                      height: 40,
                    }}
                    createOrder={handleCreateOrder("monthly")}
                    onApprove={handleApprove("monthly")}
                  />
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Yearly Plan Card */}
          <Card
            className={`relative overflow-hidden transition-all ${
              selectedPlan === "yearly"
                ? "border-primary shadow-lg scale-105"
                : "hover:border-primary/50 hover:shadow-md"
            }`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {plans.yearly.icon}
                  <CardTitle>{plans.yearly.title}</CardTitle>
                </div>
                <FaCrown
                  className={`h-6 w-6 ${
                    selectedPlan === "yearly"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <CardDescription>{plans.yearly.billingCycle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-4xl font-bold">
                  {plans.yearly.priceString}/
                </p>
                <p className="text-xs text-muted-foreground mr-2">
                  {plans.yearly.period}
                </p>
                {plans.yearly.originalPrice && (
                  <p className="text-lg text-muted-foreground line-through">
                    {plans.yearly.originalPrice}
                  </p>
                )}
                <Badge className="flex items-center gap-2">
                  <MdLocalOffer className="h-4 w-4 mr-1" />
                  {plans.yearly.discount}
                </Badge>
              </div>
              <ul className="space-y-2">
                {plans.yearly.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                {isProcessing.yearly ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processing...</p>
                  </div>
                ) : (
                  <PayPalButtons
                    style={{
                      color: "blue",
                      shape: "pill",
                      label: "pay",
                      height: 40,
                    }}
                    createOrder={handleCreateOrder("yearly")}
                    onApprove={handleApprove("yearly")}
                  />
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </PayPalScriptProvider>

      <div className="mt-12 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-center mb-6">
          Your Security is Our Priority
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="dark:bg-black bg-white p-5 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaLock className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-2">Secure Transactions</h4>
            <p className="text-sm text-gray-600">
              All payments are processed via PayPal with industry-standard
              encryption to keep your financial information secure.
            </p>
          </div>

          <div className="dark:bg-black bg-white p-5 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaShieldAlt className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-2">Privacy Guarantee</h4>
            <p className="text-sm text-gray-600">
              We never store your payment details and your personal information
              is protected in accordance with our privacy policy.
            </p>
          </div>

          <div className="dark:bg-black bg-white p-5 rounded-lg border border-gray-100 shadow-sm text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUserShield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-2">Trusted by Thousands</h4>
            <p className="text-sm text-gray-600">
              Join our community of satisfied subscribers who trust us with
              their reading experience and personal data.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center max-w-xl mx-auto">
        <h3 className="font-medium mb-2">Why Go Pro?</h3>
        <p className="text-muted-foreground text-sm">
          Note: You are not required to subscribe to use our app, but
          subscribing will unlock exclusive features and content. All
          subscription fees will be charged to your account monthly. You can
          manage or cancel your subscription at any time in your account
          settings. Thank you for using our app! If you have any questions or
          feedback, please contact us at support@novelfull.audio.
        </p>
      </div>
    </div>
  );
}

// Success screen after payment
const PaymentSuccessScreen = ({ planName }: { planName: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for subscribing to our {planName}. Your account has been
          successfully upgraded.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700">
                Refresh the page to access your premium features
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700">
                We've sent a confirmation email with your receipt
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-gray-700">
                Manage your subscription from your account settings
              </span>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};
