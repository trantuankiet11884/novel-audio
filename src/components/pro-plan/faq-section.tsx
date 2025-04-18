interface FAQSectionProps {
  selectedPlan: "monthly" | "yearly";
}

const FAQSection = ({ selectedPlan }: FAQSectionProps) => {
  return (
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
            Your subscription will be charged{" "}
            {selectedPlan === "monthly" ? "monthly" : "annually"} to your PayPal
            account until you cancel.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Can I cancel anytime?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Yes, you can cancel your subscription at any time from your account
            settings with no cancellation fees.
          </p>
        </div>
        {selectedPlan === "yearly" && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What happens if I want to cancel before the year is up?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You can cancel anytime. Your premium features will remain active
              until the end of your billing cycle.
            </p>
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            How quickly will I get access after payment?
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            You'll gain immediate access to all Pro features once your payment
            is successfully processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
