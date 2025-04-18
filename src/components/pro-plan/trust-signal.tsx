import { FaBolt, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

interface TrustSignalsProps {
  selectedPlan: "monthly" | "yearly";
}

const TrustSignals = ({ selectedPlan }: TrustSignalsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
        <div
          className={`w-12 h-12 ${
            selectedPlan === "monthly"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-pink-100 dark:bg-pink-900"
          } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <FaShieldAlt
            className={`h-6 w-6 ${
              selectedPlan === "monthly"
                ? "text-blue-600 dark:text-blue-400"
                : "text-pink-600 dark:text-pink-400"
            }`}
          />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          100% Secure Payment
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          All transactions are secured with industry standard encryption
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
        <div
          className={`w-12 h-12 ${
            selectedPlan === "monthly"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-pink-100 dark:bg-pink-900"
          } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <FaBolt
            className={`h-6 w-6 ${
              selectedPlan === "monthly"
                ? "text-blue-600 dark:text-blue-400"
                : "text-pink-600 dark:text-pink-400"
            }`}
          />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Instant Access
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Get immediate access to all pro features after successful payment
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
        <div
          className={`w-12 h-12 ${
            selectedPlan === "monthly"
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-pink-100 dark:bg-pink-900"
          } rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <FaCheckCircle
            className={`h-6 w-6 ${
              selectedPlan === "monthly"
                ? "text-blue-600 dark:text-blue-400"
                : "text-pink-600 dark:text-pink-400"
            }`}
          />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Money-Back Guarantee
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Not satisfied? Get a full refund within{" "}
          {selectedPlan === "monthly" ? "7" : "14"} days of purchase
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;
