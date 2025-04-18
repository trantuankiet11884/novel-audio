interface CustomerReviewsProps {
  selectedPlan: "monthly" | "yearly";
}

const CustomerReviews = ({ selectedPlan }: CustomerReviewsProps) => {
  return (
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
            {selectedPlan === "monthly"
              ? '"The Pro Plan is worth every penny. No more ads and the Google sync feature is incredibly useful."'
              : '"Getting the yearly plan was a no-brainer. The 30% savings made it an easy decision, and I love not having to think about monthly payments."'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {selectedPlan === "monthly" ? "— Sarah J." : "— David K."}
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
            {selectedPlan === "monthly"
              ? '"Customer support is exceptional. Any issues I had were resolved almost immediately. Highly recommend!"'
              : '"I was hesitant at first about paying for a full year, but the discount was too good to pass up. It\'s absolutely worth it!"'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {selectedPlan === "monthly" ? "— Michael T." : "— Jennifer L."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
