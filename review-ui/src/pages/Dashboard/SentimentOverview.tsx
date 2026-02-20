export default function SentimentOverview({ data }: { data: any }) {
    const total = data.total_reviews || 1;
    const positive = Math.round((data.public_reviews / total) * 100);
    const privateFeedback = Math.round((data.private_reviews / total) * 100);
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-md animate-fadeInUp">
        <h2 className="text-lg font-bold mb-4">Sentiment Overview</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Positive</span>
            <span className="font-bold text-green-600">{positive}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Private Feedback</span>
            <span className="font-bold text-red-600">{privateFeedback}%</span>
          </div>
        </div>
      </div>
    );
  }