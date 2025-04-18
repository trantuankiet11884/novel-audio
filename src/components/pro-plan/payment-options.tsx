"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Suspense } from "react";

interface PaymentOptionsProps {
  handleCreateOrder: any;
  handleApprove: any;
  isProcessing: boolean;
  variant?: "monthly" | "yearly";
}

const PaymentOptions = ({
  handleCreateOrder,
  handleApprove,
  isProcessing,
  variant = "monthly",
}: PaymentOptionsProps) => {
  return (
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
                color: variant === "monthly" ? "blue" : "silver",
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
            <div
              className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
                variant === "monthly"
                  ? "border-blue-600 dark:border-blue-400"
                  : "border-pink-600 dark:border-pink-400"
              } mx-auto`}
            ></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Processing your payment...
            </p>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default PaymentOptions;
