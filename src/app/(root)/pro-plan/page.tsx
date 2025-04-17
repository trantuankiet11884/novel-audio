"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import {
  CheckCircle,
  Shield,
  Zap,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { Suspense } from "react";
import config from "@/config/data";
import Link from "next/link";

const ProPlanPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Thông tin gói Pro Plan
  const plan = {
    name: "Pro Plan",
    price: 14.99,
    features: [
      {
        icon: <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        text: "Ad-free novel listening experience",
      },
      {
        icon: <Zap className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        text: "Google account synchronization",
      },
      {
        icon: (
          <MessageSquare className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ),
        text: "Priority customer support 24/7",
      },
      {
        icon: <Shield className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        text: "Early access to new features and novels",
      },
    ],
  };

  const handleCreateOrder = (_data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: plan.name,
          amount: {
            currency_code: "USD",
            value: plan.price.toString(),
          },
        },
      ],
    });
  };

  const handleApprove = (_data: any, actions: any) => {
    setIsProcessing(true);
    return actions.order.capture().then(function (details: any) {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Here you would typically call your backend API to record the subscription
      console.log("Payment completed by " + details.payer.name.given_name);
    });
  };

  if (paymentSuccess) {
    return <PaymentSuccessScreen planName={plan.name} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enhance Your Reading Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upgrade to Pro Plan and unlock premium features for your novel
            journey
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-12">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 py-8 px-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-blue-100">Unlock premium novel experience</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="ml-2 text-lg opacity-80">/month</span>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Billed monthly, cancel anytime
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Features Section */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                What's included:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-blue-50 dark:bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="mt-1 mr-4">{feature.icon}</div>
                    <p className="text-gray-700 dark:text-gray-200">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">
                Complete your purchase
              </h3>
              <Suspense
                fallback={
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="animate-pulse h-12 w-full bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Loading payment options...
                    </p>
                  </div>
                }
              >
                <div className="max-w-md mx-auto">
                  <PaymentOptions
                    handleCreateOrder={handleCreateOrder}
                    handleApprove={handleApprove}
                    isProcessing={isProcessing}
                  />
                </div>
              </Suspense>
            </div>
          </div>
        </div>

        {/* Trust Signals and Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              100% Secure Payment
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              All transactions are secured with industry standard encryption
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Instant Access
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get immediate access to all pro features after successful payment
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Money-Back Guarantee
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Not satisfied? Get a full refund within 7 days of purchase
            </p>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            What our members say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-3">
                "The Pro Plan is worth every penny. No more ads and the Google
                sync feature is incredibly useful."
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                — Sarah J.
              </p>
            </div>
            <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-3">
                "Customer support is exceptional. Any issues I had were resolved
                almost immediately. Highly recommend!"
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                — Michael T.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                How will I be charged?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your subscription will be charged monthly to your PayPal account
                until you cancel.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time from your
                account settings with no cancellation fees.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                How quickly will I get access after payment?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You'll gain immediate access to all Pro features once your
                payment is successfully processed.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Secure Payment Processing By
          </p>
          <Link
            href={`https://www.paypal.com/en/webapps/mpp/paypal-safety-and-security`}
            className="flex justify-center space-x-6"
            target="_blank"
          >
            <Image
              src="/logos/paypal.jpeg"
              alt="PayPal"
              width={80}
              height={30}
              className="opacity-70 hover:opacity-100 transition dark:brightness-[.85] dark:contrast-[1.1]"
            />
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy.
            <br />
            You can cancel your subscription anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

// PaymentOptions Component
const PaymentOptions = ({
  handleCreateOrder,
  handleApprove,
  isProcessing,
}: {
  handleCreateOrder: any;
  handleApprove: any;
  isProcessing: boolean;
}) => {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Complete your purchase securely with PayPal
        </p>
      </div>
      <div
        className={`transition ${
          isProcessing ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
          }}
        >
          <PayPalButtons
            style={{
              color: "blue",
              shape: "pill",
              label: "pay",
            }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
          />
        </PayPalScriptProvider>
      </div>
      {isProcessing && (
        <div className="text-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Processing your payment...
          </p>
        </div>
      )}
    </div>
  );
};

// Success screen after payment
const PaymentSuccessScreen = ({ planName }: { planName: string }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Thank you for subscribing to our {planName}. Your account has been
          successfully upgraded.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Refresh the page to access your premium features
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                We've sent a confirmation email with your receipt
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Manage your subscription from your account settings
              </span>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ProPlanPage;
