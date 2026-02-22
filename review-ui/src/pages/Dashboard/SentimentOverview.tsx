export default function SentimentOverview({ data }: { data: any }) {
  const total = data.total_reviews || 1;
  const positive = Math.round((data.public_reviews / total) * 100);
  const privateFeedback = Math.round((data.private_reviews / total) * 100);


    return (
      <div className="
        bg-white p-4 md:p-6 rounded-xl
        border border-gray-200 shadow-sm
        animate-fadeInUp
      ">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Sentiment Overview</h2>
    
        <div className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between">
            <span className="text-gray-700">Positive</span>
            <span className="font-semibold text-green-600">{positive}%</span>
          </div>
    
          <div className="flex justify-between">
            <span className="text-gray-700">Private Feedback</span>
            <span className="font-semibold text-red-600">{privateFeedback}%</span>
          </div>
        </div>
      </div>
    )
}