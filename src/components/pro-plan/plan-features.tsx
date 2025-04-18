import { FaCalendarAlt } from "react-icons/fa";

interface PlanFeaturesProps {
  activePlan: any;
  selectedPlan: "monthly" | "yearly";
}

const PlanFeatures = ({ activePlan, selectedPlan }: PlanFeaturesProps) => {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        What's included:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePlan.features.map((feature: any, index: number) => (
          <div
            key={index}
            className={`flex items-start ${
              selectedPlan === "monthly"
                ? "bg-blue-50 dark:bg-gray-700"
                : "bg-purple-50 dark:bg-gray-700"
            } p-4 rounded-lg`}
          >
            <div className="mt-1 mr-4">{feature.icon}</div>
            <p className="text-gray-700 dark:text-gray-200">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Savings Callout - Only for Yearly */}
      {selectedPlan === "yearly" && (
        <div className="bg-pink-100 dark:bg-pink-900 p-4 rounded-lg mt-8">
          <div className="flex items-start">
            <div className="mr-4 mt-1">
              <FaCalendarAlt className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                You're saving $53.98 with yearly billing!
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                The monthly plan costs $14.99/month ($179.88/year). With yearly
                billing, you pay only $10.49/month ($125.90/year).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanFeatures;
