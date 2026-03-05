import HalfCircleGauge from "./HalfCircleGauge";
import Legend from "./Legend";

export default function SentimentOverview({ data }: { data: any }) {
  const total = data.total_reviews || 1;
  const positive = Math.round((data.public_reviews / total) * 100);
  const privateFeedback = Math.round((data.private_reviews / total) * 100);
  const neutral = Math.max(0, 100 - positive - privateFeedback);

  return (
    <div
      className="
        bg-white rounded-2xl border border-gray-200 shadow-sm
        p-4 md:p-6
        space-y-4 md:space-y-6
      "
    >

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="
            w-10 h-10 md:w-12 md:h-12
            rounded-xl bg-indigo-100
            flex items-center justify-center
            text-xl md:text-2xl
          "
        >
          😊
        </div>

        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Sentiment Summary
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            The brand is being well‑received this week
          </p>
        </div>
      </div>

      {/* Main Percentage */}
      <div className="flex items-end gap-2 md:gap-3">
        <p
          className="
            text-3xl md:text-5xl
            font-bold text-gray-900 leading-none
          "
        >
          {positive}%
        </p>
        <span className="text-gray-500 text-xs md:text-sm mb-1 md:mb-2">
          Positive
        </span>
      </div>

      {/* Gauge */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[220px] md:max-w-[260px]">
          <HalfCircleGauge
            positive={positive}
            privateFeedback={privateFeedback}
          />
        </div>
      </div>

      {/* Legend */}
      <div
        className="
          flex flex-col sm:flex-row
          gap-3 sm:gap-8
          pt-1 md:pt-2
        "
      >
        <Legend label="Positive" value={positive} color="bg-blue-500" />
        <Legend label="Private Feedback" value={privateFeedback} color="bg-purple-500" />
        <Legend label="Neutral" value={neutral} color="bg-orange-500" />
      </div>
    </div>
  );
}