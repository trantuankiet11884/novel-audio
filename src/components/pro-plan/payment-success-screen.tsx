import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

interface PaymentSuccessScreenProps {
  planName: string;
}

const PaymentSuccessScreen = ({ planName }: PaymentSuccessScreenProps) => {
  const isYearly = planName.toLowerCase().includes("yearly");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-pink-950 py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900 rounded-full mx-auto flex items-center justify-center">
            <FaCheckCircle className="h-10 w-10 text-pink-500 dark:text-pink-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Thank you for subscribing to our {planName}. Your account has been
          successfully upgraded{isYearly ? " for the next 12 months" : ""}.
        </p>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h2>
          <ul className="text-left space-y-3">
            <li className="flex items-start">
              <FaCheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Refresh the page to access your premium features
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                We've sent a confirmation email with your receipt
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-2 mt-0.5" />
              <span className="text-gray-700 dark:text-gray-300">
                Manage your subscription from your account settings
              </span>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium transition"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;
