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
        relative overflow-hidden
        bg-white/80 
        backdrop-blur-2xl
        rounded-3xl
        border border-gray-200/70 
        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
        p-5 md:p-6
        space-y-6
      "
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-300/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-300/20 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <div
          className="
            w-12 h-12 rounded-2xl
            bg-gradient-to-br from-indigo-100 to-indigo-200
            flex items-center justify-center
            text-2xl shadow-inner
          "
        >
          😊
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
            Sentiment Summary
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The brand is being well‑received this week
          </p>
        </div>
      </div>

      {/* Main Percentage */}
      <div className="flex items-end gap-2 relative z-10">
        <p className="text-5xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">
          {positive}%
        </p>
        <span className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          Positive
        </span>
      </div>

      {/* Gauge */}
      <div className="w-full flex justify-center relative z-10">
        <div className="w-full max-w-[240px]">
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
          gap-4 sm:gap-8
          pt-2 relative z-10
        "
      >
        <Legend
          label="Positive"
          value={positive}
          color="bg-blue-500"
        />
        <Legend
          label="Private Feedback"
          value={privateFeedback}
          color="bg-purple-500"
        />
        <Legend
          label="Neutral"
          value={neutral}
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}