export default function SentimentOverview({ data }: { data: any }) {
  const total = data.total_reviews || 1;
  const positive = Math.round((data.public_reviews / total) * 100);
  const privateFeedback = Math.round((data.private_reviews / total) * 100);
  const neutral = Math.max(0, 100 - positive - privateFeedback);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
          😊
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sentiment Summary</h2>
          <p className="text-sm text-gray-500">
            The brand is being well‑received this week
          </p>
        </div>
      </div>

      {/* Main Percentage */}
      <div className="flex items-end gap-3">
        <p className="text-5xl font-bold text-gray-900 leading-none">
          {positive}%
        </p>
        <span className="text-gray-500 text-sm mb-2">Positive</span>
      </div>

      {/* Half Circle Gauge */}
      <div className="w-full flex justify-center">
        <HalfCircleGauge
          positive={positive}
          privateFeedback={privateFeedback}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-8 pt-2">
        <Legend label="Positive" value={positive} color="bg-blue-500" />
        <Legend label="Private Feedback" value={privateFeedback} color="bg-purple-500" />
        <Legend label="Neutral" value={neutral} color="bg-orange-500" />
      </div>
    </div>
  );
}

function Legend({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <span className="text-gray-500 text-sm">{value}%</span>
    </div>
  );
}

function HalfCircleGauge({
  positive,
  privateFeedback,
}: {
  positive: number;
  privateFeedback: number;
}) {
  const radius = 80;
  const circumference = Math.PI * radius;

  const positiveLength = (positive / 100) * circumference;
  const privateLength = (privateFeedback / 100) * circumference;

  return (
    <svg width="200" height="110" viewBox="0 0 200 110">
      {/* Background Arc */}
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Public (Blue) */}
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="#6366F1"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${positiveLength} ${circumference}`}
        strokeDashoffset={0}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />

      {/* Private Feedback (Dark Orange) */}
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="#EA580C"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${privateLength} ${circumference}`}
        strokeDashoffset={-positiveLength}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}