
import { useState } from "react";
import { motion } from "framer-motion";

const normalizeTopics = (value) => {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return { topic: item.trim(), sentiment: "neutral" };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        topic: String(item.topic || item.text || "").trim(),
        sentiment: String(item.sentiment || "neutral").toLowerCase(),
      };
    })
    .filter((item) => item && item.topic);
};

const normalizeTrends = (value) => {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return { text: item.trim() };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        text: String(item.text || item.topic || "").trim(),
      };
    })
    .filter((item) => item && item.text);
};

const shortenTopic = (topic) => {
  if (!topic) return "";

  const cleaned = String(topic)
    .replace(/[()]/g, "")
    .replace(/[/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ");

  return words.length > 2
    ? words.slice(0, 2).join(" ")
    : cleaned;
};

const getTopicEmoji = (topic) => {
  const text = topic.toLowerCase();

  if (text.includes("service")) return "🤝";
  if (text.includes("food")) return "🍽️";
  if (text.includes("drink")) return "🥤";
  if (text.includes("haircut")) return "💇";
  if (text.includes("ambiance") || text.includes("clean")) return "✨";
  if (text.includes("experience") || text.includes("place")) return "📍";

  return "✦";
};

const getTopicColor = (topic) => {
  const text = topic.toLowerCase();

  if (text.includes("service")) {
    return "border-indigo-100 bg-indigo-50 text-indigo-800";
  }

  if (text.includes("food")) {
    return "border-amber-100 bg-amber-50 text-amber-800";
  }

  if (text.includes("drink")) {
    return "border-sky-100 bg-sky-50 text-sky-800";
  }

  if (text.includes("haircut")) {
    return "border-pink-100 bg-pink-50 text-pink-800";
  }

  if (text.includes("ambiance") || text.includes("clean")) {
    return "border-emerald-100 bg-emerald-50 text-emerald-800";
  }

  if (text.includes("experience") || text.includes("place")) {
    return "border-purple-100 bg-purple-50 text-purple-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
};

function SentimentCard({ label, value, type, delay }) {
  const styles = {
    positive: {
      container: "border-emerald-100 bg-emerald-50",
      number: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    neutral: {
      container: "border-slate-200 bg-slate-50",
      number: "text-slate-700",
      dot: "bg-slate-400",
    },
    negative: {
      container: "border-rose-100 bg-rose-50",
      number: "text-rose-700",
      dot: "bg-rose-500",
    },
  };

  const style = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`rounded-2xl border p-4 ${style.container}`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        <span className="text-xs font-medium text-slate-600">
          {label}
        </span>
      </div>

      <p className={`mt-3 text-2xl font-bold tracking-tight ${style.number}`}>
        {value.toLocaleString()}
      </p>
    </motion.div>
  );
}

export default function ReviewInsightsCard({ insights }) {
  const [expanded, setExpanded] = useState(false);
  const [openTrendIndex, setOpenTrendIndex] = useState(null);

  const safeInsights =
    insights && typeof insights === "object" ? insights : {};

  const keyTopics = normalizeTopics(safeInsights.key_topics);
  const trends = normalizeTrends(safeInsights.trends);
  const sentiment = safeInsights.sentiment_breakdown || {};

  const positive = Number(sentiment.positive) || 0;
  const neutral = Number(sentiment.neutral) || 0;
  const negative = Number(sentiment.negative) || 0;

  const summary =
    typeof safeInsights.summary === "string"
      ? safeInsights.summary
      : "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative isolate overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 -top-24 h-48 w-48 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl text-white shadow-lg shadow-indigo-600/20">
          ✦
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            AI Review Insights
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Understand what your customers are saying
          </p>
        </div>

        <span className="hidden shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 sm:inline-flex">
          AI powered
        </span>
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

      {/* Key topics */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Key topics
          </h3>
          <span className="text-xs text-slate-400">
            {keyTopics.length} topics
          </span>
        </div>

        {keyTopics.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {keyTopics.map((item, index) => (
              <motion.div
                key={`${item.topic}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                title={item.topic}
                className={`flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm ${getTopicColor(item.topic)}`}
              >
                <span className="shrink-0 text-base" aria-hidden="true">
                  {getTopicEmoji(item.topic)}
                </span>

                <span className="min-w-0 break-words text-xs font-semibold leading-5 sm:text-sm">
                  {shortenTopic(item.topic)}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
            Key topics will appear when review insights are available.
          </div>
        )}
      </section>

      {/* Sentiment */}
      <section className="mt-7">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-800">
            Sentiment breakdown
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            The sentiment detected across your reviews
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <SentimentCard
            label="Positive"
            value={positive}
            type="positive"
            delay={0}
          />

          <SentimentCard
            label="Neutral"
            value={neutral}
            type="neutral"
            delay={0.08}
          />

          <SentimentCard
            label="Negative"
            value={negative}
            type="negative"
            delay={0.16}
          />
        </div>
      </section>

      {/* Trends */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Notable trends
          </h3>
          <span className="text-xs text-slate-400">
            {trends.length} observations
          </span>
        </div>

        {trends.length > 0 ? (
          <ul className="space-y-2.5">
            {trends.map((trend, index) => {
              const isOpen = openTrendIndex === index;

              return (
                <motion.li
                  key={`${trend.text}-${index}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenTrendIndex(isOpen ? null : index)
                    }
                    className="group flex w-full items-start gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 transition group-hover:bg-indigo-100">
                      {index + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm leading-6 text-slate-700 ${
                          isOpen ? "" : "line-clamp-2"
                        }`}
                      >
                        {trend.text}
                      </span>

                      <span className="mt-2 block text-xs font-semibold text-indigo-600">
                        {isOpen ? "Show less" : "Read more"}
                      </span>
                    </span>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
            Trends will appear as more customer feedback is analyzed.
          </div>
        )}
      </section>

      {/* AI summary */}
      <section className="mt-7 rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50/80 to-white p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 3v18M3 12h18" />
              <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
            </svg>
          </div>

          <h3 className="text-sm font-bold text-slate-900">
            AI summary
          </h3>
        </div>

        {summary ? (
          <>
            <p
              className={`whitespace-pre-line text-sm leading-7 text-slate-600 ${
                expanded ? "" : "line-clamp-4"
              }`}
            >
              {summary}
            </p>

            {summary.length > 180 && (
              <button
                type="button"
                onClick={() => setExpanded((previous) => !previous)}
                aria-expanded={expanded}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 transition hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {expanded ? "Show less" : "Read full summary"}

                <span aria-hidden="true">
                  {expanded ? "↑" : "→"}
                </span>
              </button>
            )}
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Your AI-generated summary will appear here once feedback has
            been analyzed.
          </p>
        )}
      </section>

      <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
        AI-generated observations may not capture every detail. Review
        individual customer feedback when making important decisions.
      </p>
    </motion.section>
  );
}