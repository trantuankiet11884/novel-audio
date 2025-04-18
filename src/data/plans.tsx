import {
  FaBolt,
  FaBookOpen,
  FaCalendarAlt,
  FaCommentAlt,
  FaShieldAlt,
} from "react-icons/fa";

export const plans = {
  monthly: {
    name: "Pro Plan Monthly",
    price: 14.99,
    features: [
      {
        icon: (
          <FaBookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ),
        text: "Ad-free novel listening experience",
      },
      {
        icon: <FaBolt className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
        text: "Google account synchronization",
      },
      {
        icon: (
          <FaCommentAlt className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ),
        text: "Priority customer support 24/7",
      },
      {
        icon: (
          <FaShieldAlt className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        ),
        text: "Early access to new features and novels",
      },
    ],
  },
  yearly: {
    name: "Pro Plan Yearly",
    price: 125.9, // 30% discount from $179.88 ($14.99 x 12)
    originalPrice: 179.88,
    savings: 53.98,
    features: [
      {
        icon: (
          <FaBookOpen className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        ),
        text: "Ad-free novel listening experience",
      },
      {
        icon: <FaBolt className="h-5 w-5 text-pink-500 dark:text-pink-400" />,
        text: "Google account synchronization",
      },
      {
        icon: (
          <FaCommentAlt className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        ),
        text: "Priority customer support 24/7",
      },
      {
        icon: (
          <FaShieldAlt className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        ),
        text: "Early access to new features and novels",
      },
      {
        icon: (
          <FaCalendarAlt className="h-5 w-5 text-pink-500 dark:text-pink-400" />
        ),
        text: "30% savings compared to monthly billing",
      },
    ],
  },
};
